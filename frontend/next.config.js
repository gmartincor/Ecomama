const createNextIntlPlugin = require('next-intl/plugin');
const withPWA = require('@ducanh2912/next-pwa').default;
const { runtimeCaching } = require('./src/lib/workbox.config.ts');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['localhost'],
  },

  experimental: {
    serverComponentsExternalPackages: ['leaflet'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

// PWA Configuration
const withPWAConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_PWA !== 'true',
  register: true,
  skipWaiting: true,
  scope: '/',
  sw: 'sw.js',
  fallbacks: {
    document: '/offline',
  },
  workboxOptions: {
    disableDevLogs: process.env.NODE_ENV === 'production',
    runtimeCaching,
  },
});

module.exports = withPWAConfig(withNextIntl(nextConfig));
