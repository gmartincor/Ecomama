'use client';

import { useEffect } from 'react';
import PWAInstallBanner from './PWAInstallBanner';
import PWAUpdateNotification from './PWAUpdateNotification';
import OnlineStatusIndicator from './OnlineStatusIndicator';
import { initPWAAnalytics } from '@/lib/pwa-analytics';

/**
 * PWA Provider Component
 * Wraps all PWA-related UI components in one place
 * 
 * Features:
 * - Install banner
 * - Update notification
 * - Online status indicator
 * - Analytics initialization
 * 
 * @component
 * @example
 * ```tsx
 * <PWAProvider>
 *   <App />
 * </PWAProvider>
 * ```
 */
export default function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPWAAnalytics();
  }, []);

  return (
    <>
      {children}
      <PWAInstallBanner />
      <PWAUpdateNotification />
      <OnlineStatusIndicator />
    </>
  );
}
