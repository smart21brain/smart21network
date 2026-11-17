/* Smart21network service worker: newest copy first, saved copy when offline */
const V = 's21c-2026-11-v21';
const ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'fonts/poppins-latin-500-normal.woff2', 'fonts/poppins-latin-600-normal.woff2', 'fonts/poppins-latin-700-normal.woff2', 'fonts/poppins-latin-800-normal.woff2', 'fonts/fa-solid-900.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin || u.pathname.startsWith('/api/')) return;
  /* pages, scripts, styles, images: try the NEWEST copy first (so an update shows on the first reload), fall back to the saved copy when offline or slow */
  const fresh = r.mode === 'navigate' || u.pathname.endsWith('/') || /\.(html|webmanifest|js|css|png|ico)$/.test(u.pathname);
  if (fresh) {
    e.respondWith(new Promise(resolve => {
      let done = false;
      const t = setTimeout(() => caches.match(r).then(h => { if (h && !done) { done = true; resolve(h); } }), 3500);
      fetch(r).then(res => {
        clearTimeout(t);
        if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
        if (!done) { done = true; resolve(res); }
      }).catch(() => caches.match(r).then(h => { clearTimeout(t); if (!done) { done = true; resolve(h || caches.match('index.html')); } }));
    }));
    return;
  }
  /* fonts and other big static files: saved copy first */
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; }).catch(() => caches.match('index.html'))));
});
