/* KoïKoSamui — service worker (PWA installable + hors-ligne « jungle proof ») */
const VERSION = 'koikosamui-v4';
const IMG_CACHE = 'koiko-img-v1';
const KEEP = [VERSION, IMG_CACHE];
const IMG_MAX = 120; // plafond LRU du cache images

const CORE = [
  '/',
  '/carte',
  '/a-propos',
  '/offline',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Hôtes d'images distants (photos d'espèces).
const IMG_HOSTS = new Set([
  'upload.wikimedia.org',
  'commons.wikimedia.org',
  'inaturalist-open-data.s3.amazonaws.com',
  'static.inaturalist.org',
]);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(CORE))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

// Garde le cache images sous un plafond (supprime les plus anciennes entrées).
async function trimImageCache() {
  const cache = await caches.open(IMG_CACHE);
  const keys = await cache.keys();
  if (keys.length <= IMG_MAX) return;
  await Promise.all(
    keys.slice(0, keys.length - IMG_MAX).map((k) => cache.delete(k)),
  );
}

// Cache-first pour les images (revalidation en arrière-plan) — sert hors-ligne.
function handleImage(event) {
  event.respondWith(
    caches.open(IMG_CACHE).then((cache) =>
      cache.match(event.request).then((cached) => {
        const network = fetch(event.request)
          .then((res) => {
            if (res && (res.ok || res.type === 'opaque')) {
              cache.put(event.request, res.clone());
              trimImageCache();
            }
            return res;
          })
          .catch(() => cached);
        return cached || network;
      }),
    ),
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Vidéos (animation d'ouverture…) : laisser le navigateur gérer les
  // requêtes Range — ne pas intercepter ni mettre en cache.
  if (
    request.destination === 'video' ||
    /\.(mov|mp4|m4v|webm)(\?|$)/i.test(url.pathname)
  ) {
    return;
  }

  // Images distantes (Wikimedia / iNaturalist) — cache dédié plafonné.
  if (IMG_HOSTS.has(url.hostname)) {
    handleImage(event);
    return;
  }

  // On n'intercepte pas le reste du cross-origin (tuiles CARTO, API…).
  if (url.origin !== self.location.origin) return;

  // Images optimisées par next/image (même origine) — même cache plafonné.
  if (url.pathname.startsWith('/_next/image')) {
    handleImage(event);
    return;
  }

  // Ne pas mettre en cache les routes API (OG dynamique…).
  if (url.pathname.startsWith('/api/')) return;

  // Assets immuables Next : cache-first.
  if (
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/patterns/')
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
    return;
  }

  // Navigations : réseau d'abord, repli cache, puis page hors-ligne.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match('/offline')),
        ),
    );
    return;
  }

  // Autres GET même origine : stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
