type Locale = 'en' | 'es';

interface ManifestConfig {
  name: string;
  shortName: string;
  description: string;
  startUrl: string;
  lang: Locale;
}

const MANIFEST_CONFIGS: Record<Locale, ManifestConfig> = {
  en: {
    name: 'Ecomama - Organic Marketplace',
    shortName: 'Ecomama',
    description: 'A multi-user platform connecting farmers and consumers for the direct purchase of organic products. More than a marketplace, a cultural movement.',
    startUrl: '/',
    lang: 'en',
  },
  es: {
    name: 'Ecomama - Mercado Orgánico',
    shortName: 'Ecomama',
    description: 'Una plataforma multiusuario que conecta agricultores y consumidores para la compra directa de productos orgánicos. Más que un marketplace, un movimiento cultural.',
    startUrl: '/es',
    lang: 'es',
  },
};

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

const generateIcons = () => {
  const icons = [];
  
  for (const size of ICON_SIZES) {
    icons.push(
      {
        src: `/icons/icon-${size}x${size}.svg`,
        sizes: `${size}x${size}`,
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: `/icons/icon-${size}x${size}-maskable.svg`,
        sizes: `${size}x${size}`,
        type: 'image/svg+xml',
        purpose: 'maskable',
      }
    );
  }
  
  return icons;
};

const generateShortcuts = (locale: Locale) => {
  const shortcuts = {
    en: [
      {
        name: 'Marketplace',
        short_name: 'Market',
        description: 'Browse organic products',
        url: '/marketplace',
        icons: [{ src: '/icons/shortcut-marketplace.svg', sizes: '96x96', type: 'image/svg+xml' }],
      },
      {
        name: 'Events',
        short_name: 'Events',
        description: 'Discover community events',
        url: '/events',
        icons: [{ src: '/icons/shortcut-events.svg', sizes: '96x96', type: 'image/svg+xml' }],
      },
      {
        name: 'Chat',
        short_name: 'Chat',
        description: 'Message with farmers',
        url: '/chat',
        icons: [{ src: '/icons/shortcut-chat.svg', sizes: '96x96', type: 'image/svg+xml' }],
      },
    ],
    es: [
      {
        name: 'Mercado',
        short_name: 'Mercado',
        description: 'Explorar productos orgánicos',
        url: '/es/marketplace',
        icons: [{ src: '/icons/shortcut-mercado.svg', sizes: '96x96', type: 'image/svg+xml' }],
      },
      {
        name: 'Eventos',
        short_name: 'Eventos',
        description: 'Descubrir eventos comunitarios',
        url: '/es/events',
        icons: [{ src: '/icons/shortcut-eventos.svg', sizes: '96x96', type: 'image/svg+xml' }],
      },
      {
        name: 'Chat',
        short_name: 'Chat',
        description: 'Mensajear con agricultores',
        url: '/es/chat',
        icons: [{ src: '/icons/shortcut-chat.svg', sizes: '96x96', type: 'image/svg+xml' }],
      },
    ],
  };
  
  return shortcuts[locale];
};

export const generateManifest = (locale: Locale = 'en') => {
  const config = MANIFEST_CONFIGS[locale];
  
  return {
    name: config.name,
    short_name: config.shortName,
    description: config.description,
    start_url: config.startUrl,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#16a34a',
    orientation: 'portrait-primary',
    scope: '/',
    lang: config.lang,
    dir: 'ltr',
    categories: ['food', 'shopping', 'social', 'education'],
    icons: generateIcons(),
    screenshots: [
      {
        src: '/screenshots/marketplace-wide.svg',
        sizes: '1280x720',
        type: 'image/svg+xml',
        form_factor: 'wide',
        label: locale === 'es' ? 'Mercado con vista de mapa' : 'Marketplace with map view',
      },
      {
        src: '/screenshots/marketplace-mobile.svg',
        sizes: '750x1334',
        type: 'image/svg+xml',
        form_factor: 'narrow',
        label: locale === 'es' ? 'Vista móvil del mercado' : 'Mobile marketplace view',
      },
    ],
    shortcuts: generateShortcuts(locale),
    share_target: {
      action: locale === 'es' ? '/es/share' : '/share',
      method: 'POST',
      enctype: 'multipart/form-data',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
      },
    },
    related_applications: [],
    prefer_related_applications: false,
  };
};
