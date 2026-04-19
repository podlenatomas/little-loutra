# Deployment — littleloutra.com on Cloudflare

Domain is registered/managed at Cloudflare, deploy stays in one place.

This project uses **Cloudflare Workers with Static Assets** (the modern unified
Workers + Pages model). Configuration: `wrangler.jsonc`. Worker entry: `src/worker.js`.

## 1. Connect the repo

1. Push the repo to GitHub.
2. Cloudflare Dashboard → **Workers & Pages → Create → Workers → Import a repository**.
   (Important: pick **Workers**, not the legacy "Pages" flow — the project is
   configured as Workers + Static Assets.)
3. Pick `podlenatomas/little-loutra`, branch `main`.
4. **Build configuration**:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Root directory: `/` (empty)
5. Set **NODE_VERSION = 20** under build environment variables.
6. **Save and Deploy**.

You'll get a worker URL like `little-loutra.<account>.workers.dev`.

## 2. Custom domain (littleloutra.com)

Because the domain is already in Cloudflare DNS:

1. Worker → **Settings → Domains & Routes → Add → Custom domain**.
2. Enter `littleloutra.com`, confirm — DNS record is created automatically.
3. Add `www.littleloutra.com` the same way (the `_redirects` file 301s `www → apex`).
4. SSL certs auto-issue.

## 3. Environment variables

Worker → **Settings → Variables and Secrets**. Two kinds:

- **Plaintext variables** (visible in dashboard): `RESERVATION_TO_EMAIL`, `RESERVATION_FROM`
- **Secrets** (encrypted): `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`

Build-time variables (used during `npm run build` and inlined into the JS bundle)
go under **Build → Variables** in deployment settings. These need a re-deploy to
take effect.

| Var | Type | Where |
|---|---|---|
| `RESEND_API_KEY` | Secret | Runtime |
| `RESERVATION_TO_EMAIL` | Plaintext | Runtime, value `stay@littleloutra.com` |
| `RESERVATION_FROM` | Plaintext | Runtime, `Little Loutra <stay@littleloutra.com>` |
| `TURNSTILE_SECRET_KEY` | Secret | Runtime |
| `VITE_TURNSTILE_SITE_KEY` | Plaintext | **Build** (must rebuild after change) |
| `NODE_VERSION` | Plaintext | **Build**, value `20` |

After adding `VITE_*` or `NODE_VERSION`, **trigger a fresh deploy**.

## 4. Resend (transactional email)

1. Sign up at https://resend.com (free: 3 000 emails/month).
2. **Domains → Add Domain → `littleloutra.com`**.
3. Resend shows DNS records (SPF + DKIM, optional DMARC). Since DNS is at Cloudflare:
   - Cloudflare Dashboard → **DNS → Records** for `littleloutra.com`
   - Add the records exactly as Resend shows them
   - Set them to **DNS only** (grey cloud), NOT proxied (orange) — proxying breaks email
4. Wait for Resend to verify the domain.
5. Create an API Key (type: **Sending**) → put it into Worker secrets as `RESEND_API_KEY`.

## 5. Turnstile captcha

1. Cloudflare Dashboard → **Turnstile → Add site**.
2. Domain: `littleloutra.com` (add `*.workers.dev` too if you want preview deploys to work).
3. Widget mode: **Managed**.
4. Copy **Site Key** → `VITE_TURNSTILE_SITE_KEY` (Build variable; needs redeploy).
5. Copy **Secret Key** → `TURNSTILE_SECRET_KEY` (Runtime secret).

Without these, the widget doesn't render and the API skips verification (honeypot
+ rate-limit still protect the form).

## 6. Architecture summary

- `wrangler.jsonc` — Worker config (assets binding, SPA fallback, Node compat)
- `src/worker.js` — Worker entry; routes `POST /api/reserve` to handler, falls
  through to `env.ASSETS.fetch(request)` for static files
- `functions/api/reserve.js` — handler, imported by the worker. Uses the same
  shape as Pages Functions (`onRequestPost({ request, env })`) so it's portable
- `dist/` — Vite build output, served as static assets
- `public/_headers` — security/cache headers per route
- `public/_redirects` — `www → apex` 301 (the SPA fallback is now handled by
  `not_found_handling: "single-page-application"` in wrangler.jsonc)

## 7. Post-deploy verification

On the live site:

- [ ] `https://littleloutra.com/` loads, `www.` 301s to apex
- [ ] All 4 language switches work (EN/EL/CS/DE)
- [ ] Gallery photos render (`/images/apt-*.jpg`)
- [ ] Map embed shows
- [ ] Cookie banner appears + persists choice
- [ ] Legal modals open
- [ ] Reservation form: fill test data, submit:
  - Captcha widget renders
  - Email arrives at `stay@littleloutra.com`
  - Success message shows
- [ ] Page source: dynamic `<meta description>` per locale, canonical, JSON-LD
- [ ] OG preview: https://www.opengraph.xyz/ with `https://littleloutra.com`
- [ ] Lighthouse: Performance > 85, SEO 100, Accessibility > 90
- [ ] `curl -I https://littleloutra.com/` shows CSP / HSTS / X-Frame-Options

## 8. SEO submission (optional)

- Google Search Console: add property `https://littleloutra.com`, verify via DNS
  TXT (in Cloudflare DNS), submit `https://littleloutra.com/sitemap.xml`.
- Bing Webmaster Tools: same.

## 9. Local development

```bash
# Vite dev server only (no API)
npm run dev

# Full Worker + assets locally (dist + functions)
npm run build && npm run cf:dev
```

`npm run cf:dev` runs `wrangler dev`, which simulates the production Worker
runtime including the API endpoint and static asset binding. Hot-reload Vite
isn't compatible with this — rebuild after each change.

## 10. Updating the site

`git push origin main` → Cloudflare auto-deploys to production. Photos: drop
into `/public/images/apt-XX.jpg` and push.

## Troubleshooting

| Symptom | Check |
|---|---|
| "Variables cannot be added to a Worker that only has static assets" | The Worker has no script. Confirm `wrangler.jsonc` has `main: "src/worker.js"` and re-deploy. |
| Form submit fails silently | Worker → Logs (real-time tail). Look for `[reserve] Missing RESEND_API_KEY` |
| Captcha not appearing | `VITE_TURNSTILE_SITE_KEY` set as **Build** variable AND re-deployed |
| Captcha fails on submit | Turnstile site domain must include the URL exactly. Add `*.workers.dev` for preview. |
| Emails in spam | SPF/DKIM/DMARC at Cloudflare DNS, all set to grey cloud (DNS-only) |
| Google Maps iframe blank | CSP `frame-src` already allows google.com; check browser console |
| Social preview broken | Re-scrape: https://developers.facebook.com/tools/debug/ |
| `/api/reserve` returns 404 | Confirm `wrangler.jsonc` has `main: "src/worker.js"` and `src/worker.js` exists |
| 404 on SPA routes | `wrangler.jsonc` should have `assets.not_found_handling: "single-page-application"` |
