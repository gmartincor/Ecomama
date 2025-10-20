/**
 * Workbox Caching Configuration
 * Defines cache durations and entry limits for different resource types
 * Optimized for PWA performance and offline capabilities
 */

const CACHE_DURATIONS = {
  fonts: 365 * 24 * 60 * 60,      // 1 year - fonts rarely change
  mapTiles: 30 * 24 * 60 * 60,    // 30 days - map tiles are large
  images: 7 * 24 * 60 * 60,       // 7 days - balance freshness/storage
  staticAssets: 30 * 24 * 60 * 60, // 30 days - JS/CSS versioned
  apiData: 60 * 60,               // 1 hour - dynamic data
  apiDynamic: 10 * 60,            // 10 minutes - frequently changing
  pages: 24 * 60 * 60,            // 24 hours - page content
} as const;

const CACHE_ENTRIES = {
  fonts: 10,          // Limited font files
  mapTiles: 200,      // Many tiles for offline maps
  images: 100,        // Product/profile images
  nextImages: 100,    // Optimized Next.js images
  staticAssets: 60,   // JS/CSS bundles
  nextData: 50,       // Next.js data payloads
  apiDynamic: 30,     // API responses
  pages: 50,          // HTML pages
} as const;

export const runtimeCaching = [
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'fonts',
      expiration: {
        maxEntries: CACHE_ENTRIES.fonts,
        maxAgeSeconds: CACHE_DURATIONS.fonts,
      },
    },
  },
  {
    urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'map-tiles',
      expiration: {
        maxEntries: CACHE_ENTRIES.mapTiles,
        maxAgeSeconds: CACHE_DURATIONS.mapTiles,
      },
    },
  },
  {
    urlPattern: /\.(?:woff2?|ttf|otf|eot)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'fonts',
      expiration: {
        maxEntries: CACHE_ENTRIES.fonts,
        maxAgeSeconds: CACHE_DURATIONS.fonts,
      },
    },
  },
  {
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images',
      expiration: {
        maxEntries: CACHE_ENTRIES.images,
        maxAgeSeconds: CACHE_DURATIONS.images,
      },
    },
  },
  {
    urlPattern: /\/_next\/image\?url=.+$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'next-images',
      expiration: {
        maxEntries: CACHE_ENTRIES.nextImages,
        maxAgeSeconds: CACHE_DURATIONS.images,
      },
    },
  },
  {
    urlPattern: /\.(?:js|css)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-assets',
      expiration: {
        maxEntries: CACHE_ENTRIES.staticAssets,
        maxAgeSeconds: CACHE_DURATIONS.staticAssets,
      },
    },
  },
  {
    urlPattern: /\/_next\/data\/.+\.json$/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'next-data',
      networkTimeoutSeconds: 3,
      expiration: {
        maxEntries: CACHE_ENTRIES.nextData,
        maxAgeSeconds: CACHE_DURATIONS.apiData,
      },
    },
  },
  {
    urlPattern: /\/api\/(products|farmers|events).*$/i,
    handler: 'NetworkFirst',
    method: 'GET',
    options: {
      cacheName: 'api-dynamic',
      networkTimeoutSeconds: 5,
      expiration: {
        maxEntries: CACHE_ENTRIES.apiDynamic,
        maxAgeSeconds: CACHE_DURATIONS.apiDynamic,
      },
    },
  },
  {
    urlPattern: /\/api\/(auth|profile|cart|orders).*$/i,
    handler: 'NetworkOnly',
    method: 'GET',
  },
  {
    urlPattern: /\/api\/.*$/i,
    handler: 'NetworkOnly',
    method: 'POST',
  },
  {
    urlPattern: /\/api\/.*$/i,
    handler: 'NetworkOnly',
    method: 'PUT',
  },
  {
    urlPattern: /\/api\/.*$/i,
    handler: 'NetworkOnly',
    method: 'DELETE',
  },
  {
    urlPattern: /.*/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'pages',
      networkTimeoutSeconds: 5,
      expiration: {
        maxEntries: CACHE_ENTRIES.pages,
        maxAgeSeconds: CACHE_DURATIONS.pages,
      },
    },
  },
];
