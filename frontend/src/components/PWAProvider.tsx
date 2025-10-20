'use client';

import PWAInstallBanner from './PWAInstallBanner';
import PWAUpdateNotification from './PWAUpdateNotification';
import OnlineStatusIndicator from './OnlineStatusIndicator';

/**
 * PWA Provider Component
 * Wraps all PWA-related UI components in one place
 * 
 * Features:
 * - Install banner
 * - Update notification
 * - Online status indicator
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
  return (
    <>
      {children}
      <PWAInstallBanner />
      <PWAUpdateNotification />
      <OnlineStatusIndicator />
    </>
  );
}
