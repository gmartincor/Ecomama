const CACHE_NAME = 'ecomama-v3';
const STATIC_ASSETS = [
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

const shouldBypassCache = (url) => {
  return (
    url.includes('/_next/') ||
    url.includes('/__nextjs') ||
    url.includes('/api/') ||
    url.includes('/login') ||
    url.includes('/register') ||
    url.includes('/profile') ||
    url.includes('/tablon') ||
    url.includes('/events') ||
    url.includes('/listings') ||
    url.includes('/map') ||
    url.includes('/settings') ||
    url.includes('/superadmin')
  );
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (
    shouldBypassCache(event.request.url) ||
    event.request.method !== 'GET' ||
    event.request.mode === 'navigate'
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request, {
        redirect: 'follow'
      }).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
