const CACHE_VERSION = 'v8';
const CACHE_NAME = `ecomama-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `ecomama-runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `ecomama-images-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline',
];

const CACHE_STATIC_PATTERNS = [
  /\/_next\/static\/.*/,
  /\/icons\/.*/,
];

const CACHE_IMAGE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
];

const BYPASS_PATTERNS = [
  /\/api\/.*/,
  /\/_next\/webpack-hmr/,
  /\/__nextjs/,
  /\/socket\.io/,
];

const HTML_PATTERNS = [
  /\.html$/,
  /\/$/,
  /^\/[^.]*$/,
];

const MAX_AGE = {
  static: 30 * 24 * 60 * 60,
  runtime: 24 * 60 * 60,
  images: 7 * 24 * 60 * 60,
};

const shouldBypass = (url) => {
  return BYPASS_PATTERNS.some(pattern => pattern.test(url));
};

const shouldCacheStatic = (url) => {
  return CACHE_STATIC_PATTERNS.some(pattern => pattern.test(url));
};

const shouldCacheImage = (url) => {
  return CACHE_IMAGE_PATTERNS.some(pattern => pattern.test(url));
};

const isHTML = (url) => {
  return HTML_PATTERNS.some(pattern => pattern.test(url));
};

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'CLIENTS_CLAIM') {
    self.clients.claim();
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .catch(err => console.warn('SW: Cache static assets failed:', err))
      .finally(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => 
        Promise.all(
          cacheNames
            .filter(name => 
              name.startsWith('ecomama-') && 
              ![CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE].includes(name)
            )
            .map(name => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

const networkFirst = async (request, cacheName, timeout = 2000) => {
  const cache = await caches.open(cacheName);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (response && response.status === 200) {
      cache.put(request, response.clone()).catch(() => {});
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const offlinePage = await cache.match('/offline');
    if (offlinePage && request.mode === 'navigate') {
      return offlinePage;
    }
    
    return new Response(
      JSON.stringify({ 
        offline: true, 
        message: 'Sin conexión' 
      }),
      { 
        status: 503, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

const cacheFirst = async (request, cacheName, maxAge) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    const cachedDate = new Date(cachedResponse.headers.get('date') || 0);
    const age = (Date.now() - cachedDate.getTime()) / 1000;
    
    if (age < maxAge) {
      fetch(request).then(response => {
        if (response && response.status === 200) {
          cache.put(request, response.clone()).catch(() => {});
        }
      }).catch(() => {});
      
      return cachedResponse;
    }
  }
  
  try {
    const response = await fetch(request);
    
    if (response && response.status === 200) {
      cache.put(request, response.clone()).catch(() => {});
    }
    
    return response;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  if (shouldBypass(url.pathname)) {
    return;
  }

  if (shouldCacheStatic(url.pathname)) {
    event.respondWith(cacheFirst(request, CACHE_NAME, MAX_AGE.static));
    return;
  }

  if (shouldCacheImage(url.pathname)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, MAX_AGE.images));
    return;
  }

  if (isHTML(url.pathname)) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});
