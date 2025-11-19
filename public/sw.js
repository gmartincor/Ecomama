const CACHE_VERSION = 'v4';
const CACHE_NAME = `ecomama-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

const BYPASS_PATTERNS = [
  '/_next/',
  '/__nextjs',
  '/api/',
  '/login',
  '/register',
  '/profile',
  '/tablon',
  '/events',
  '/listings',
  '/map',
  '/settings',
  '/superadmin',
];

const shouldBypassCache = (url) => {
  return BYPASS_PATTERNS.some(pattern => url.includes(pattern));
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .catch(err => console.error('Cache install error:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => 
        Promise.all(
          cacheNames
            .filter(name => name.startsWith('ecomama-') && name !== CACHE_NAME)
            .map(name => caches.delete(name))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  if (
    shouldBypassCache(request.url) ||
    request.method !== 'GET' ||
    request.mode === 'navigate'
  ) {
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
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseToCache))
              .catch(err => console.error('Cache put error:', err));

            return response;
          })
          .catch(() => new Response('Offline', { 
            status: 503,
            statusText: 'Service Unavailable'
          }));
      })
  );
});
