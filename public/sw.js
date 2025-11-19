const CACHE_VERSION = 'v6';
const CACHE_NAME = `ecomama-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

const DYNAMIC_CACHE = `ecomama-dynamic-${CACHE_VERSION}`;

const BYPASS_PATTERNS = [
  '/api/',
  '/_next/static/webpack/',
  '/__nextjs',
];

const CACHE_PATTERNS = [
  '/icons/',
  '/_next/static/',
];

const shouldBypassCache = (url) => {
  return BYPASS_PATTERNS.some(pattern => url.includes(pattern));
};

const shouldCache = (url) => {
  return CACHE_PATTERNS.some(pattern => url.includes(pattern));
};

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.error('Failed to cache assets:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => 
        Promise.all(
          cacheNames
            .filter(name => name.startsWith('ecomama-') && name !== CACHE_NAME && name !== DYNAMIC_CACHE)
            .map(name => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || shouldBypassCache(url.pathname)) {
    return;
  }

  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then(response => {
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            if (shouldCache(url.pathname)) {
              const responseToCache = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseToCache))
                .catch(err => console.error('Cache error:', err));
            }

            return response;
          })
          .catch(() => {
            return caches.match('/').then(fallback => fallback || new Response('Offline'));
          });
      })
  );
});
