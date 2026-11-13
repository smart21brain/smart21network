// Builds ./www for the WEBSITE: the app (same as Android) + SEO pages, sitemap, robots.txt, social image, headers and a 404 page.
require('./prep-android.js');
const fs = require('fs'), path = require('path');
const { SITE, pages, sw } = require('./seo-pages.js');
const root = path.join(__dirname, '..'), www = path.join(root, 'www');
const today = new Date().toISOString().slice(0, 10);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const all = pages.concat([sw]);
const url = p => SITE + (p ? '/' + p.slug + '/' : '/');
const bySlug = Object.fromEntries(all.map(p => [p.slug, p]));

const CSS = ':root{--g:#084F39;--g2:#0B6E4F;--y:#FFC93C;--ink:#14231c;--mut:#4a5d54;--bg:#f6faf8}*{box-sizing:border-box}body{margin:0;font:17px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:var(--ink);background:var(--bg)}' +
  'header{background:var(--g);color:#fff}.w{max-width:860px;margin:0 auto;padding:0 18px}.bar{display:flex;align-items:center;gap:14px;padding:12px 0;flex-wrap:wrap}.bar a{color:#fff;text-decoration:none}.brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:1.1rem}.brand img{border-radius:50%}.bar nav{margin-left:auto;display:flex;gap:16px;font-size:.95rem}' +
  'h1{font-size:clamp(1.7rem,4.6vw,2.4rem);line-height:1.2;margin:1.4rem 0 .6rem}h2{font-size:1.4rem;margin:2rem 0 .5rem;color:var(--g)}.lead{font-size:1.15rem;color:var(--mut)}' +
  '.cta{display:inline-block;background:var(--y);color:#222;font-weight:700;padding:.8rem 1.4rem;border-radius:999px;text-decoration:none;margin:1rem 0}.cta:hover{filter:brightness(.95)}' +
  'pre{background:#0d1f18;color:#d7f5e5;padding:14px 16px;border-radius:12px;overflow:auto;font:14px/1.5 ui-monospace,Consolas,monospace}ul,ol{padding-left:1.3rem}li{margin:.3rem 0}' +
  'details{background:#fff;border:1px solid #d9e6df;border-radius:12px;padding:.7rem 1rem;margin:.6rem 0}summary{cursor:pointer;font-weight:600}.rel{display:flex;flex-wrap:wrap;gap:10px;padding:0;list-style:none}.rel a{display:block;background:#fff;border:1px solid #d9e6df;border-radius:999px;padding:.4rem .9rem;text-decoration:none;color:var(--g)}' +
  'footer{margin-top:3rem;background:#0d1f18;color:#bcd3c8;font-size:.9rem;padding:1.6rem 0}footer a{color:#e7f5ee}.fl{display:flex;flex-wrap:wrap;gap:8px 16px;padding:0;list-style:none}.note{opacity:.8;margin-top:1rem}';

function block(s) {
  let o = '<h2>' + esc(s.h2) + '</h2>';
  if (s.p) o += '<p>' + esc(s.p) + '</p>';
  if (s.list) o += '<ul>' + s.list.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
  if (s.ol) o += '<ol>' + s.ol.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>';
  if (s.code) o += '<pre><code>' + esc(s.code.join('\n')) + '</code></pre>';
  return o;
}
function page(p) {
  const lang = p.lang || 'en', u = url(p), isSw = lang === 'sw';
  const cta = isSw ? 'Fungua simulator bure' : 'Open the simulator (free)', rel = isSw ? 'Soma pia' : 'Related guides', fq = isSw ? 'Maswali yanayoulizwa mara nyingi' : 'Frequently asked questions';
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': u + '#webpage', url: u, name: p.title, description: p.desc, inLanguage: lang, isPartOf: { '@id': SITE + '/#website' }, primaryImageOfPage: { '@type': 'ImageObject', url: SITE + '/og-image.png' }, dateModified: today },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Smart21network', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: p.nav, item: u }] },
    { '@type': 'FAQPage', mainEntity: p.faq.map(f => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) }
  ] };
  const alt = isSw ? '<link rel="alternate" hreflang="sw" href="' + u + '"><link rel="alternate" hreflang="en" href="' + SITE + '/"><link rel="alternate" hreflang="x-default" href="' + SITE + '/">' : '';
  return '<!DOCTYPE html><html lang="' + lang + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + esc(p.title) + '</title><meta name="description" content="' + esc(p.desc) + '"><link rel="canonical" href="' + u + '">' + alt +
    '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><meta name="theme-color" content="#0B6E4F">' +
    '<link rel="icon" href="/favicon.ico?v=3" sizes="48x48"><link rel="icon" type="image/png" href="/favicon-32.png?v=3" sizes="32x32"><link rel="icon" type="image/png" href="/icon-192.png?v=3" sizes="192x192"><link rel="shortcut icon" href="/favicon.ico?v=3"><link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3">' +
    '<meta property="og:type" content="website"><meta property="og:site_name" content="Smart21network"><meta property="og:title" content="' + esc(p.title) + '"><meta property="og:description" content="' + esc(p.desc) + '"><meta property="og:url" content="' + u + '"><meta property="og:image" content="' + SITE + '/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Smart21network, a free online network simulator">' +
    '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="' + esc(p.title) + '"><meta name="twitter:description" content="' + esc(p.desc) + '"><meta name="twitter:image" content="' + SITE + '/og-image.png">' +
    '<script type="application/ld+json">' + JSON.stringify(ld) + '</script><style>' + CSS + '</style></head><body>' +
    '<header><div class="w bar"><a class="brand" href="/"><img src="/icon-192.png" width="36" height="36" alt="Smart21network logo">Smart21network</a><nav><a href="/network-simulator/">' + (isSw ? 'Mwongozo' : 'Guides') + '</a><a href="/">' + (isSw ? 'Simulator' : 'Simulator') + '</a>' + (isSw ? '<a href="/network-simulator/" hreflang="en">English</a>' : '<a href="/sw/" hreflang="sw">Kiswahili</a>') + '</nav></div></header>' +
    '<main class="w"><nav aria-label="Breadcrumb" style="font-size:.9rem;margin-top:1rem"><a href="/">Smart21network</a> › ' + esc(p.nav) + '</nav><h1>' + esc(p.h1) + '</h1><p class="lead">' + esc(p.lead) + '</p><a class="cta" href="/">' + cta + '</a>' +
    p.sections.map(block).join('') + '<h2>' + fq + '</h2>' + p.faq.map(f => '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>').join('') +
    '<h2>' + rel + '</h2><ul class="rel">' + (p.related || []).map(s => '<li><a href="/' + s + '/">' + esc(bySlug[s].nav) + '</a></li>').join('') + '</ul><a class="cta" href="/">' + cta + '</a></main>' +
    '<footer><div class="w"><ul class="fl">' + all.map(x => '<li><a href="/' + x.slug + '/">' + esc(x.nav) + '</a></li>').join('') + '<li><a href="https://smart21brain.com">Smart21Brain</a></li></ul>' +
    '<p class="note">' + esc(p.note || NOTE_FALLBACK) + '</p><p>© ' + new Date().getFullYear() + ' Smart21Brain</p></div></footer></body></html>';
}
const NOTE_FALLBACK = 'Smart21network is an independent learning tool by Smart21Brain. Product names belong to their owners.';

all.forEach(p => { const d = path.join(www, p.slug); fs.mkdirSync(d, { recursive: true }); fs.writeFileSync(path.join(d, 'index.html'), page(p)); });

// sitemap (with English / Kiswahili alternates for the home page)
const urls = [{ loc: SITE + '/', pr: '1.0', alt: true }].concat(all.map(p => ({ loc: url(p), pr: p.slug === 'network-simulator' ? '0.9' : '0.7', alt: p.slug === 'sw' })));
fs.writeFileSync(path.join(www, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  urls.map(u => '  <url><loc>' + u.loc + '</loc><lastmod>' + today + '</lastmod><priority>' + u.pr + '</priority>' + (u.alt ? '<xhtml:link rel="alternate" hreflang="en" href="' + SITE + '/"/><xhtml:link rel="alternate" hreflang="sw" href="' + SITE + '/sw/"/><xhtml:link rel="alternate" hreflang="x-default" href="' + SITE + '/"/>' : '') + '</url>').join('\n') + '\n</urlset>\n');
fs.writeFileSync(path.join(www, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ' + SITE + '/sitemap.xml\n');
fs.copyFileSync(path.join(root, 'seo', 'og-image.png'), path.join(www, 'og-image.png'));
['favicon.ico', 'favicon-32.png', 'apple-touch-icon.png'].forEach(f => fs.copyFileSync(path.join(root, f), path.join(www, f)));
fs.writeFileSync(path.join(www, '404.html'), '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><link rel="icon" href="/favicon.ico?v=3" sizes="48x48"><link rel="icon" type="image/png" href="/favicon-32.png?v=3" sizes="32x32"><title>Page not found – Smart21network</title><style>body{font:18px system-ui,sans-serif;background:#084F39;color:#fff;text-align:center;padding:12vh 20px}a{color:#FFC93C}</style></head><body><img src="/icon-192.png" width="96" height="96" alt="" style="border-radius:50%"><h1>Page not found</h1><p>That page does not exist. <a href="/">Open the Smart21network simulator</a> or read the <a href="/network-simulator/">network simulator guide</a>.</p></body></html>');
fs.writeFileSync(path.join(www, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), geolocation=()\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n/*.png\n  Cache-Control: public, max-age=604800\n/favicon.ico\n  Cache-Control: public, max-age=604800\n/sw.js\n  Cache-Control: no-cache\n');
console.log('[web] www/ is ready with ' + all.length + ' SEO pages, sitemap.xml, robots.txt, _headers and 404.html');
