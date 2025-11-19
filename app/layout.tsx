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
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4a9d5f',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
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
