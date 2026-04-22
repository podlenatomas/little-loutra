// Cloudflare Worker entry point.
// - GET /__version → diagnostic marker (proves a fresh deploy is live)
// - POST /api/reserve → reservation handler
// - www.* → 301 to apex
// - Everything else → static assets binding (dist/), with SPA fallback for
//   unknown paths via wrangler.jsonc `not_found_handling: "single-page-application"`

import { onRequestPost as reservePost, onRequestDiag } from './api/reserve.js';

const VERSION = 'v10-2026-04-22-gsc-file';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // www → apex (301), preserves path + query
        if (url.hostname.startsWith('www.')) {
            url.hostname = url.hostname.slice(4);
            return Response.redirect(url.toString(), 301);
        }

        // Diagnostic — confirms which worker version is running
        if (url.pathname === '/__version') {
            return new Response(VERSION, {
                status: 200,
                headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' }
            });
        }

        // Google Search Console verification file. Served verbatim so CF Assets
        // doesn't redirect /foo.html → /foo (default html_handling), which
        // would break GSC's exact-URL check.
        if (url.pathname === '/google9bc3dbb3e7d9a947.html') {
            return new Response('google-site-verification: google9bc3dbb3e7d9a947.html\n', {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'public, max-age=3600'
                }
            });
        }

        // Env var presence check — safe to be public, booleans only
        if (url.pathname === '/api/diag' && request.method === 'GET') {
            return onRequestDiag({ request, env, ctx });
        }

        if (url.pathname === '/api/reserve') {
            if (request.method === 'POST') {
                return reservePost({ request, env, ctx });
            }
            return new Response('Method not allowed', {
                status: 405,
                headers: { Allow: 'POST', 'Content-Type': 'text/plain' }
            });
        }

        return env.ASSETS.fetch(request);
    }
};
