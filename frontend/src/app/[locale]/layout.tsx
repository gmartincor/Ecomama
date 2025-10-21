import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Poppins } from 'next/font/google';
import { LOCALES, isValidLocale } from '@/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import PWAProvider from '@/components/PWAProvider';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import { AuthProvider } from '@/lib/auth-context';
import { getPWAMetadata, viewport as pwaViewport } from '@/lib/pwa-metadata';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const generateStaticParams = () => 
  LOCALES.map((locale) => ({ locale }));

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

/**
 * Generate metadata for the locale-specific layout
 * Includes PWA configuration
 */
export async function generateMetadata({ params: { locale } }: LocaleLayoutProps) {
  return getPWAMetadata(locale);
}

/**
 * Export viewport configuration for PWA
 */
export const viewport = pwaViewport;

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  if (!isValidLocale(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ecomama" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
      </head>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <PWAProvider>
              <div className="flex flex-col min-h-screen">
                <EmailVerificationBanner />
                <LanguageSwitcher />
                {children}
              </div>
            </PWAProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
