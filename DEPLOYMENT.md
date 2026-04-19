# Deployment — littleloutra.com on Cloudflare Pages

Domain is registered/managed at Cloudflare, so deployment stays in one place.

## 1. Connect the repo to Cloudflare Pages

1. Push the repo to GitHub (or GitLab — Cloudflare supports both).
2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo `podlenatomas/little-loutra`.
4. **Build configuration**:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (empty)
   - Node.js version: **20.x** (Settings → Environment variables → build → `NODE_VERSION=20`)
5. **Save and Deploy**. First build takes ~30–60 s.

You'll get a preview URL like `little-loutra.pages.dev`.

## 2. Custom domain (littleloutra.com)

Because the domain is already in Cloudflare DNS:

1. In the Pages project → **Custom domains → Set up a custom domain**.
2. Enter `littleloutra.com`, confirm — Cloudflare auto-creates the CNAME record in your DNS.
3. Add `www.littleloutra.com` the same way (the `_redirects` file 301s `www → apex`).
4. SSL certs auto-issue (Cloudflare SSL, free).

## 3. Environment variables

Pages has three environments: **Production**, **Preview**, and **Build**. Build-time vars (prefixed `VITE_`) are inlined into the JS bundle during `npm run build`. Runtime vars are available to Pages Functions.

Settings → **Environment variables → Production** (also **Preview** if you want the same on preview URLs):

| Var | Type | Value |
|---|---|---|
| `RESEND_API_KEY` | Secret | `re_…` (from resend.com) |
| `RESERVATION_TO_EMAIL` | Plain | `stay@littleloutra.com` |
| `RESERVATION_FROM` | Plain | `Little Loutra <stay@littleloutra.com>` |
| `TURNSTILE_SECRET_KEY` | Secret | Cloudflare Turnstile secret key |
| `VITE_TURNSTILE_SITE_KEY` | Plain (build-time) | Cloudflare Turnstile site key |
| `NODE_VERSION` | Plain (build-time) | `20` |

After adding `VITE_*` or `NODE_VERSION` vars, **re-trigger a deploy** (they only take effect at build time).

## 4. Resend (transactional email)

1. Sign up at https://resend.com (free: 3 000 emails/month).
2. **Domains → Add Domain → `littleloutra.com`**.
3. Resend shows DNS records. Since DNS is already at Cloudflare:
   - Cloudflare Dashboard → **DNS → Records**
   - Add the SPF `TXT`, DKIM `TXT`, and optional DMARC `TXT` Resend specifies
   - Important: set these records to **DNS only** (grey cloud), NOT proxied (orange)
4. Wait for Resend to verify the domain.
5. Create an API Key (type: **Sending**) → copy it to `RESEND_API_KEY` in Pages env vars.

## 5. Turnstile captcha

1. Cloudflare Dashboard → **Turnstile → Add site**.
2. Domain: `littleloutra.com`, Widget mode: **Managed**.
3. Copy **Site Key** → `VITE_TURNSTILE_SITE_KEY` (Pages env, production AND preview, mark as Build variable).
4. Copy **Secret Key** → `TURNSTILE_SECRET_KEY` (Pages env, production, mark as Secret).
5. Re-deploy so the site key gets baked into the build.

Without these env vars, the widget won't render and the API skips verification (honeypot + rate-limit still protect the form).

## 6. Pages Functions

- Location: `/functions/api/reserve.js`
- Route: `POST /api/reserve` — auto-mapped by Pages from the file path.
- Runtime: Cloudflare Workers (V8, not Node). Uses Web APIs (`fetch`, `Response`, `URLSearchParams`).
- Environment vars reach the function via the `env` parameter, not `process.env`.

Nothing to configure — Pages picks up `functions/` automatically on deploy.

## 7. Post-deploy verification

On the live site:

- [ ] `https://littleloutra.com/` loads, `www.` redirects to apex (301)
- [ ] All 4 language switches work (EN/EL/CS/DE)
- [ ] Gallery photos render (`/images/apt-*.jpg`)
- [ ] Map section shows embedded Google Maps
- [ ] Cookie banner appears on first visit, choice persists
- [ ] Legal modals open (Privacy / Terms / Cancellation / Cookies)
- [ ] Reservation form — fill test data, submit:
  - Captcha widget renders (env vars set)
  - Email arrives at `stay@littleloutra.com` (Resend configured)
  - Success message shows
- [ ] View page source:
  - `<meta name="description">` reflects current language (updated by JS)
  - `<link rel="canonical">` = `https://littleloutra.com/`
  - JSON-LD `LodgingBusiness` schema present
- [ ] OG preview: https://www.opengraph.xyz/ with `https://littleloutra.com`
- [ ] Lighthouse: Performance > 85, SEO = 100, Accessibility > 90
- [ ] Response headers (`curl -I https://littleloutra.com/`) show CSP / HSTS / X-Frame-Options

## 8. SEO submission (optional)

- Google Search Console: add property, verify via DNS TXT (at Cloudflare DNS), submit `https://littleloutra.com/sitemap.xml`.
- Bing Webmaster Tools: same.

## 9. Local development

```bash
# Vite dev server (no Pages Functions)
npm run dev

# With Pages Functions (runs the reservation API locally)
npm run build && npx wrangler pages dev dist
```

`wrangler pages dev` simulates the full Cloudflare Pages runtime including Functions.

## 10. Updating the site

1. `git push origin main` — Cloudflare auto-deploys to production.
2. Feature-branch pushes auto-deploy to a preview URL.
3. Photos: drop into `/public/images/apt-XX.jpg` and push.

## Troubleshooting

| Symptom | Check |
|---|---|
| Form submit fails silently | Pages → Functions → Logs. Look for `[reserve] Missing RESEND_API_KEY` |
| Captcha not appearing | `VITE_TURNSTILE_SITE_KEY` set AND re-deployed (build-time inlined). Try hard refresh. |
| Captcha fails on submit | Turnstile site domain must match deploy URL exactly. Preview URLs need a separate Turnstile site or wildcard domain entry. |
| Emails in spam | SPF/DKIM/DMARC DNS records on littleloutra.com (Cloudflare DNS → grey cloud, not proxied) |
| Google Maps iframe blank | CSP `frame-src` already allows google.com; check browser console |
| Social preview broken | Re-scrape: https://developers.facebook.com/tools/debug/ |
| DNS not propagating | Cloudflare DNS is instant within Cloudflare. If using an external registrar, wait. |
| 404 on SPA routes | Confirm `public/_redirects` contains `/*  /index.html  200` |
