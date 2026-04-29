// Post-build static prerender.
// Reads dist/index.html (Vite output) and produces 4 locale variants:
//   dist/index.html      (en, default / x-default)
//   dist/el/index.html   (Greek)
//   dist/cs/index.html   (Czech)
//   dist/de/index.html   (German)
//
// Each variant has:
//   - <html lang="XX">
//   - localized <title>, description, OG/Twitter meta, canonical
//   - path-based hreflang alternates (already in template)
//   - localized JSON-LD: LodgingBusiness + FAQPage
//   - a <noscript> semantic body block — read by LLM crawlers and non-JS Googlebot
//
// JS users never see the <noscript>; React hydrates into #root as usual.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BASE_URL = 'https://littleloutra.com';
const OG_LOCALE = { en: 'en_US', el: 'el_GR', cs: 'cs_CZ', de: 'de_DE' };
const LOCALES = ['en', 'el', 'cs', 'de'];

const localeData = {};
for (const lng of LOCALES) {
    const mod = await import(path.join(ROOT, 'src', 'locales', `${lng}.js`));
    localeData[lng] = mod.default;
}

const esc = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const baseHref = (lng) => lng === 'en' ? `${BASE_URL}/` : `${BASE_URL}/${lng}/`;

function buildSchema(lng) {
    const t = localeData[lng];
    const lodging = {
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        '@id': `${BASE_URL}/#lodging`,
        name: 'Little Loutra',
        description: t.meta.description,
        url: baseHref(lng),
        image: `${BASE_URL}/og-image.jpg`,
        email: 'stay@littleloutra.com',
        telephone: '+306955644151',
        priceRange: '€€',
        petsAllowed: true,
        checkinTime: '15:00',
        checkoutTime: '11:00',
        numberOfRooms: 1,
        numberOfBedrooms: 1,
        maximumAttendeeCapacity: 4,
        occupancy: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 4 },
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Mpoleti 6',
            addressLocality: 'Loutraki',
            postalCode: '203 00',
            addressCountry: 'GR'
        },
        geo: { '@type': 'GeoCoordinates', latitude: 37.994248, longitude: 22.923831 },
        hasMap: 'https://www.google.com/maps/place/37%C2%B059\'39.3%22N+22%C2%B055\'25.8%22E/@37.994248,22.923831,17z',
        containedInPlace: {
            '@type': 'TouristDestination',
            name: 'Loutraki',
            sameAs: [
                'https://en.wikipedia.org/wiki/Loutraki',
                'https://www.wikidata.org/wiki/Q620518'
            ]
        },
        amenityFeature: t.amenities.items.map((a) => ({
            '@type': 'LocationFeatureSpecification',
            name: a.title,
            value: true
        }))
    };

    const faq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: lng,
        mainEntity: t.faq.items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a }
        }))
    };

    return `<script type="application/ld+json">
${JSON.stringify(lodging, null, 2)}
</script>
    <script type="application/ld+json">
${JSON.stringify(faq, null, 2)}
</script>`;
}

function buildNoscript(lng) {
    const t = localeData[lng];
    const features = [t.features.guests, t.features.bedroom, t.features.sea, t.features.athens];
    const parts = [];
    parts.push('<noscript>');
    parts.push('<header>');
    parts.push(`<h1>${esc(t.hero.title)}</h1>`);
    parts.push(`<p>${esc(t.hero.subtitle)}</p>`);
    parts.push('</header>');
    parts.push('<main>');

    parts.push(`<section><h2>${esc(t.about.title)}</h2><p>${esc(t.about.description)}</p></section>`);

    parts.push('<section>');
    parts.push(`<h2>${esc(t.features.title)}</h2>`);
    parts.push(`<ul>${features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>`);
    parts.push('</section>');

    parts.push('<section>');
    parts.push(`<h2>${esc(t.amenities.title)}</h2>`);
    parts.push(`<ul>${t.amenities.items.map((a) => `<li>${esc(a.title)}</li>`).join('')}</ul>`);
    parts.push('</section>');

    parts.push('<section>');
    parts.push(`<h2>${esc(t.surroundings.title)}</h2>`);
    parts.push(`<p>${esc(t.surroundings.subtitle)}</p>`);
    parts.push('<dl>');
    for (const i of t.surroundings.items) {
        parts.push(`<dt>${esc(i.title)}</dt><dd>${esc(i.desc)}</dd>`);
    }
    parts.push('</dl>');
    parts.push('</section>');

    parts.push('<section>');
    parts.push(`<h2>${esc(t.meaning.title)}</h2>`);
    parts.push(`<p>${esc(t.meaning.etymology)}</p>`);
    parts.push('</section>');

    parts.push('<section>');
    parts.push(`<h2>${esc(t.pricing.title)}</h2>`);
    parts.push(`<p>${esc(t.pricing.subtitle)}</p>`);
    parts.push(`<ul>${t.pricing.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`);
    parts.push('</section>');

    parts.push('<section>');
    parts.push(`<h2>${esc(t.faq.title)}</h2>`);
    parts.push('<dl>');
    for (const f of t.faq.items) {
        parts.push(`<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`);
    }
    parts.push('</dl>');
    parts.push('</section>');

    parts.push('<section>');
    parts.push(`<h2>${esc(t.location.title)}</h2>`);
    parts.push(`<address>${esc(t.location.address)}</address>`);
    parts.push('</section>');

    parts.push('</main>');
    parts.push('</noscript>');
    return parts.join('\n    ');
}

function generate(template, lng) {
    const t = localeData[lng];
    const href = baseHref(lng);
    let html = template;

    html = html.replace(/<html lang="[^"]*"/, `<html lang="${lng}"`);
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(t.meta.title)}</title>`);
    html = html.replace(
        /<meta name="description" content="[^"]*"\s*\/?>/,
        `<meta name="description" content="${esc(t.meta.description)}" />`
    );
    html = html.replace(
        /<link rel="canonical" href="[^"]*"\s*\/?>/,
        `<link rel="canonical" href="${href}" />`
    );
    html = html.replace(
        /<meta property="og:url" content="[^"]*"\s*\/?>/,
        `<meta property="og:url" content="${href}" />`
    );
    html = html.replace(
        /<meta property="og:locale" content="[^"]*"\s*\/?>/,
        `<meta property="og:locale" content="${OG_LOCALE[lng]}" />`
    );
    html = html.replace(
        /<meta property="og:title" content="[^"]*"\s*\/?>/,
        `<meta property="og:title" content="${esc(t.meta.title)}" />`
    );
    html = html.replace(
        /<meta property="og:description" content="[^"]*"\s*\/?>/,
        `<meta property="og:description" content="${esc(t.meta.description)}" />`
    );
    html = html.replace(
        /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
        `<meta name="twitter:title" content="${esc(t.meta.title)}" />`
    );
    html = html.replace(
        /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
        `<meta name="twitter:description" content="${esc(t.meta.description)}" />`
    );

    html = html.replace(
        /<!-- PRERENDER:SCHEMA -->[\s\S]*?<!-- \/PRERENDER:SCHEMA -->/,
        `<!-- PRERENDER:SCHEMA -->\n    ${buildSchema(lng)}\n    <!-- /PRERENDER:SCHEMA -->`
    );

    html = html.replace(
        /<!-- PRERENDER:NOSCRIPT -->[\s\S]*?<!-- \/PRERENDER:NOSCRIPT -->/,
        `<!-- PRERENDER:NOSCRIPT -->\n    ${buildNoscript(lng)}\n    <!-- /PRERENDER:NOSCRIPT -->`
    );

    return html;
}

async function main() {
    const templatePath = path.join(DIST, 'index.html');
    const template = await readFile(templatePath, 'utf8');

    for (const lng of LOCALES) {
        const html = generate(template, lng);
        const outPath = lng === 'en'
            ? templatePath
            : path.join(DIST, lng, 'index.html');
        if (lng !== 'en') await mkdir(path.dirname(outPath), { recursive: true });
        await writeFile(outPath, html, 'utf8');
        console.log(`[prerender] wrote ${path.relative(ROOT, outPath)}`);
    }
}

main().catch((e) => {
    console.error('[prerender] FAILED:', e);
    process.exit(1);
});
