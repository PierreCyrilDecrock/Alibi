/* Service worker d'Alibi : le jeu fonctionne hors ligne.
   Pour publier une nouvelle version : changez VERSION ci-dessous (ex. alibi-2),
   les téléphones récupèrent alors la nouvelle version au lancement suivant. */
const VERSION = 'alibi-12';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Cache d'abord, mise à jour en arrière-plan (jeu + polices Google). */
function staleWhileRevalidate(req) {
  return caches.open(VERSION).then((cache) =>
    cache.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate') {
      e.respondWith(caches.match('./index.html').then((hit) => hit || fetch(req)));
      e.waitUntil(caches.open(VERSION).then((c) => fetch('./index.html', { cache: 'no-cache' }).then((r) => r.ok && c.put('./index.html', r)).catch(() => {})));
      return;
    }
    e.respondWith(staleWhileRevalidate(req));
  } else if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(staleWhileRevalidate(req));
  }
});
