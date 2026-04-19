// Cloudflare Worker entry point.
// Routes /api/* to serverless handlers; everything else falls through to the
// static assets binding (dist/), which serves the built SPA. The wrangler
// config sets `not_found_handling: "single-page-application"` so any
// non-matching path returns index.html with 200.

import { onRequestPost as reservePost } from '../functions/api/reserve.js';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

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
