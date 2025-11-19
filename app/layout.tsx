import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./leaflet.css";
import { Providers } from "@/components/common/Providers";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { PWAManager } from "@/features/pwa";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ecomama - Productos Ecológicos Directos',
  description: 'Conectando agricultores y consumidores en comunidades locales para el comercio directo de productos ecológicos',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ecomama',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Ecomama - Productos Ecológicos Directos',
    description: 'Conectando agricultores y consumidores en comunidades locales',
    type: 'website',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Ecomama Logo',
      },
    ],
  },
  applicationName: 'Ecomama',
  keywords: ['productos ecológicos', 'agricultores locales', 'comercio directo', 'sostenibilidad', 'comunidad'],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#4a9d5f',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ecomama" />
        <meta name="application-name" content="Ecomama" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}>
        <Providers>
          <AuthGuard>
            <PWAManager />
            {children}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
