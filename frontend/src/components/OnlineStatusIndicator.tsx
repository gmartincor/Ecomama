'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useOnlineStatus } from '@/lib/hooks/usePWA';
import { PWA_CONFIG } from '@/lib/pwa-config';

/**
 * Online Status Indicator Component
 * Shows a notification when the user goes offline or comes back online
 * 
 * Features:
 * - Auto-detects network status changes
 * - Temporary notifications
 * - Accessibility support
 * 
 * @component
 * @example
 * ```tsx
 * <OnlineStatusIndicator />
 * ```
 */
export default function OnlineStatusIndicator() {
  const t = useTranslations('pwa.status');
  const isOnline = useOnlineStatus();
  const [showNotification, setShowNotification] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!PWA_CONFIG.FEATURES.OFFLINE_INDICATOR) return;

    // Show notification when status changes
    if (!isOnline) {
      setShowNotification(true);
      setWasOffline(true);
    } else if (wasOffline) {
      // User came back online
      setShowNotification(true);
      
      // Hide "back online" notification after configured timeout
      const timer = setTimeout(() => {
        setShowNotification(false);
        setWasOffline(false);
      }, PWA_CONFIG.OFFLINE.NOTIFICATION_TIMEOUT_MS);

      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification) {
    return null;
  }

  return (
    <div
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transform rounded-lg px-4 py-3 shadow-lg transition-all ${
        isOnline
          ? 'bg-green-50 border border-green-200'
          : 'bg-yellow-50 border border-yellow-200'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        {/* Status Icon */}
        <div className="flex-shrink-0">
          {isOnline ? (
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
        </div>

        <p className={`text-sm font-medium ${isOnline ? 'text-green-800' : 'text-yellow-800'}`}>
          {isOnline ? t('online') : t('offline')}
        </p>

        {!isOnline && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-yellow-600 hover:text-yellow-800"
            aria-label="Dismiss"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {!isOnline && (
        <p className="mt-1 text-xs text-yellow-700">
          {t('offlineDescription')}
        </p>
      )}
    </div>
  );
}
