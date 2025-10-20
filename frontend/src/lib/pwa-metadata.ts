import type { Metadata, Viewport } from 'next';

/**
 * PWA Metadata Configuration
 * Defines Progressive Web App metadata for app installation and behavior
 * 
 * @module pwa-metadata
 */

const APP_NAME = 'Ecomama';
const APP_DESCRIPTION =
  'A multi-user platform connecting farmers and consumers for the direct purchase of organic products. More than a marketplace, a cultural movement.';
const THEME_COLOR = '#16a34a';
const BACKGROUND_COLOR = '#ffffff';

/**
 * Viewport configuration for PWA
 */
export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

/**
 * Get PWA metadata for a specific locale
 * @param locale - The locale code (e.g., 'en', 'es')
 * @returns Metadata object with PWA configuration
 */
export function getPWAMetadata(locale: string = 'en'): Metadata {
  const isSpanish = locale === 'es';
  const manifestUrl = isSpanish ? '/manifest.es.json' : '/manifest.json';

  return {
    applicationName: APP_NAME,
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    manifest: manifestUrl,
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: APP_NAME,
      startupImage: [
        {
          url: '/icons/icon-512x512.svg',
          media: '(device-width: 768px) and (device-height: 1024px)',
        },
      ],
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      type: 'website',
      siteName: APP_NAME,
      title: {
        default: APP_NAME,
        template: `%s | ${APP_NAME}`,
      },
      description: APP_DESCRIPTION,
    },
    twitter: {
      card: 'summary_large_image',
      title: {
        default: APP_NAME,
        template: `%s | ${APP_NAME}`,
      },
      description: APP_DESCRIPTION,
    },
    icons: {
      icon: [
        { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
        { url: '/icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      ],
    },
  };
}

/**
 * PWA theme colors configuration
 */
export const pwaColors = {
  theme: THEME_COLOR,
  background: BACKGROUND_COLOR,
} as const;
