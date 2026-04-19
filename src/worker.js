// Cloudflare Worker entry point.
// - Routes /api/* to serverless handlers
// - Permanent-redirects www.* to the apex
// - Falls through to the static assets binding (dist/) for everything else.
//   wrangler.jsonc sets `not_found_handling: "single-page-application"`, so any
//   non-matching asset path returns index.html with 200 (the SPA handles routing).

import { onRequestPost as reservePost } from '../functions/api/reserve.js';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // www → apex (301), preserves path + query
        if (url.hostname.startsWith('www.')) {
            url.hostname = url.hostname.slice(4);
            return Response.redirect(url.toString(), 301);
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
