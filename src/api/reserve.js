// Cloudflare Pages Function — reservation request handler.
// Route: POST /api/reserve
//
// Environment variables (set in Cloudflare Pages → Settings → Environment variables):
//   RESEND_API_KEY         — from https://resend.com
//   RESERVATION_TO_EMAIL   — mailbox that receives requests (e.g. stay@littleloutra.com)
//   RESERVATION_FROM       — verified sender, e.g. "Little Loutra <stay@littleloutra.com>"
//   TURNSTILE_SECRET_KEY   — Cloudflare Turnstile secret (optional; if set, captcha enforced)
//
// Runtime: Cloudflare Workers (V8, not Node). fetch / URLSearchParams / Response / Map
// are native. No `process.env` — vars come in via the `env` parameter.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// In-memory rate limit, per Worker isolate. Best-effort; real protection lives
// at the Cloudflare WAF / Bot Management layer.
const buckets = new Map();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 5;

function rateLimited(ip) {
    const now = Date.now();
    const hits = (buckets.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    if (hits.length >= MAX_PER_WINDOW) return true;
    hits.push(now);
    buckets.set(ip, hits);
    return false;
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const json = (status, data) => new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
});

async function verifyTurnstile(secret, token, ip) {
    if (!secret) {
        console.warn('[reserve] TURNSTILE_SECRET_KEY not set, skipping captcha check');
        return true;
    }
    if (!token) return false;
    try {
        const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ secret, response: token, remoteip: ip })
        });
        const result = await r.json();
        return result.success === true;
    } catch (err) {
        console.error('[reserve] Turnstile verify error:', err);
        return false;
    }
}

export async function onRequestPost(context) {
    const { request, env } = context;

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    if (rateLimited(ip)) return json(429, { error: 'Too many requests' });

    let body;
    try {
        body = await request.json();
    } catch {
        return json(400, { error: 'Invalid JSON body' });
    }

    // Honeypot: bots tend to fill every field.
    if (body.website && String(body.website).trim() !== '') {
        return json(200, { ok: true }); // silent drop
    }

    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : '';
    const checkIn = typeof body.checkIn === 'string' ? body.checkIn : '';
    const checkOut = typeof body.checkOut === 'string' ? body.checkOut : '';
    const guests = typeof body.guests === 'string' ? body.guests : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 1000) : '';
    const locale = typeof body.locale === 'string' ? body.locale.slice(0, 8) : 'en';
    const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken : '';

    if (!name) return json(400, { error: 'Missing name' });
    if (!EMAIL_RE.test(email)) return json(400, { error: 'Invalid email' });
    if (!ISO_DATE_RE.test(checkIn) || !ISO_DATE_RE.test(checkOut)) {
        return json(400, { error: 'Invalid dates' });
    }
    if (checkOut <= checkIn) return json(400, { error: 'Invalid date range' });
    if (!['1', '2', '3', '4'].includes(guests)) return json(400, { error: 'Invalid guests' });

    // Captcha check (only enforced when TURNSTILE_SECRET_KEY is set).
    const captchaOk = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, captchaToken, ip);
    if (!captchaOk) return json(403, { error: 'Captcha verification failed' });

    const apiKey = env.RESEND_API_KEY;
    const to = env.RESERVATION_TO_EMAIL;
    const from = env.RESERVATION_FROM || 'Little Loutra <onboarding@resend.dev>';

    if (!apiKey || !to) {
        console.warn('[reserve] Missing RESEND_API_KEY or RESERVATION_TO_EMAIL — not sending email');
        return json(200, { ok: true, warning: 'Email delivery not configured' });
    }

    const html = `
        <h2>New reservation request — Little Loutra</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
          <tr><td><b>Name</b></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><b>Email</b></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><b>Check-in</b></td><td>${escapeHtml(checkIn)}</td></tr>
          <tr><td><b>Check-out</b></td><td>${escapeHtml(checkOut)}</td></tr>
          <tr><td><b>Guests</b></td><td>${escapeHtml(guests)}</td></tr>
          <tr><td><b>Locale</b></td><td>${escapeHtml(locale)}</td></tr>
          <tr><td><b>IP</b></td><td>${escapeHtml(ip)}</td></tr>
        </table>
        ${message ? `<h3>Message</h3><p style="white-space:pre-wrap">${escapeHtml(message)}</p>` : ''}
    `;

    try {
        const r = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from,
                to: [to],
                reply_to: email,
                subject: `Reservation request: ${name} (${checkIn} → ${checkOut})`,
                html
            })
        });

        if (!r.ok) {
            const detail = await r.text();
            console.error('[reserve] Resend failed:', r.status, detail);
            return json(502, { error: 'Email delivery failed' });
        }
        return json(200, { ok: true });
    } catch (err) {
        console.error('[reserve] fetch error:', err);
        return json(502, { error: 'Email delivery failed' });
    }
}
