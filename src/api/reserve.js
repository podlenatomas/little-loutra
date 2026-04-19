// Reservation request handler (Cloudflare Worker runtime).
// Route: POST /api/reserve  (routed via src/worker.js)
// Diag:  GET  /api/diag     (routed via src/worker.js)
//
// Env vars (Cloudflare Workers → Settings → Variables and Secrets):
//   RESEND_API_KEY         — https://resend.com (Secret)
//   RESERVATION_TO_EMAIL   — e.g. stay@littleloutra.com (Plaintext)
//   RESERVATION_FROM       — e.g. "Little Loutra <stay@littleloutra.com>" (Plaintext)
//   TURNSTILE_SECRET_KEY   — Cloudflare Turnstile secret (Secret; optional)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// In-memory rate limit, per Worker isolate (best-effort).
const buckets = new Map();
const WINDOW_MS = 60 * 60 * 1000;
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
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});

async function verifyTurnstile(secret, token, ip) {
    if (!secret) {
        console.warn('[reserve] TURNSTILE_SECRET_KEY not set — skipping captcha check');
        return true;
    }
    if (!token) {
        console.warn('[reserve] Missing captcha token from client');
        return false;
    }
    try {
        const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ secret, response: token, remoteip: ip })
        });
        const result = await r.json();
        if (!result.success) {
            console.error('[reserve] Turnstile rejected:', JSON.stringify(result));
        }
        return result.success === true;
    } catch (err) {
        console.error('[reserve] Turnstile verify threw:', err);
        return false;
    }
}

// GET /api/diag — reports presence (not values) of expected env vars.
// Safe to be public; leaks no secrets.
export async function onRequestDiag(context) {
    const { env } = context;
    return json(200, {
        env: {
            RESEND_API_KEY: Boolean(env.RESEND_API_KEY),
            RESERVATION_TO_EMAIL: Boolean(env.RESERVATION_TO_EMAIL),
            RESERVATION_FROM: Boolean(env.RESERVATION_FROM),
            TURNSTILE_SECRET_KEY: Boolean(env.TURNSTILE_SECRET_KEY)
        },
        runtime: 'cloudflare-workers',
        timestamp: new Date().toISOString()
    });
}

export async function onRequestPost(context) {
    const { request, env } = context;
    const reqId = request.headers.get('CF-Ray') || 'no-ray';
    const log = (level, ...args) => console[level](`[reserve ${reqId}]`, ...args);

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    if (rateLimited(ip)) {
        log('warn', 'rate limited', ip);
        return json(429, { error: 'Too many requests' });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        log('warn', 'invalid JSON body');
        return json(400, { error: 'Invalid JSON body' });
    }

    // Honeypot: bots tend to fill every field.
    if (body.website && String(body.website).trim() !== '') {
        log('warn', 'honeypot triggered — silent drop');
        return json(200, { ok: true });
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

    // Captcha
    const captchaOk = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, captchaToken, ip);
    if (!captchaOk) {
        log('warn', 'captcha failed');
        return json(403, { error: 'Captcha verification failed' });
    }

    const apiKey = env.RESEND_API_KEY;
    const to = env.RESERVATION_TO_EMAIL;
    const from = env.RESERVATION_FROM || 'Little Loutra <onboarding@resend.dev>';

    if (!apiKey) {
        log('error', 'RESEND_API_KEY not set in Worker env — cannot send email');
        return json(503, { error: 'Email service not configured (RESEND_API_KEY)' });
    }
    if (!to) {
        log('error', 'RESERVATION_TO_EMAIL not set in Worker env — cannot send email');
        return json(503, { error: 'Email service not configured (RESERVATION_TO_EMAIL)' });
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
        log('info', `sending via Resend: from="${from}" to="${to}"`);
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

        const responseText = await r.text();

        if (!r.ok) {
            log('error', `Resend responded ${r.status}:`, responseText);
            return json(502, {
                error: 'Email delivery failed',
                upstream_status: r.status,
                upstream_detail: responseText
            });
        }
        log('info', 'Resend accepted:', responseText);
        return json(200, { ok: true });
    } catch (err) {
        log('error', 'fetch to Resend threw:', err && err.message ? err.message : err);
        return json(502, { error: 'Email delivery failed', detail: String(err) });
    }
}
