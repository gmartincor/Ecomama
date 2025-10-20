/**
 * PWA Analytics Utility
 * Tracks PWA-specific events for monitoring and improvement
 * 
 * @module pwa-analytics
 */

/**
 * PWA Event Types
 */
import { getPlatform, getDeviceType } from './pwa-utils';

export type PWAEventType =
  | 'pwa_installed'
  | 'pwa_update_available'
  | 'pwa_update_installed'
  | 'pwa_offline_mode'
  | 'pwa_online_mode'
  | 'pwa_install_prompt_shown'
  | 'pwa_install_prompt_dismissed'
  | 'pwa_install_prompt_accepted';

/**
 * Track PWA event
 * In production, this should send to your analytics service (Google Analytics, Mixpanel, etc.)
 * 
 * @param event - The PWA event type
 * @param metadata - Additional metadata about the event
 * 
 * @example
 * ```typescript
 * trackPWAEvent('pwa_installed', { 
 *   platform: 'android',
 *   source: 'install_banner'
 * });
 * ```
 */
export function trackPWAEvent(
  event: PWAEventType,
  metadata?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined') return;

  try {
    const eventData = {
      event,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    if ('gtag' in window) {
      (window as any).gtag('event', event, metadata);
    }

    if (process.env.NODE_ENV === 'development') {
      window.dispatchEvent(new CustomEvent('pwa-analytics', { detail: eventData }));
    }
  } catch {
    // Silent fail
  }
}

/**
 * Get PWA installation metrics
 * @returns Object with installation-related metrics
 */
export function getPWAMetrics() {
  if (typeof window === 'undefined') {
    return null;
  }

  const metrics = {
    isInstalled: window.matchMedia('(display-mode: standalone)').matches,
    isOnline: navigator.onLine,
    hasServiceWorker: 'serviceWorker' in navigator,
    hasPushNotifications: 'PushManager' in window,
    hasNotifications: 'Notification' in window,
    platform: getPlatform(),
    deviceType: getDeviceType(),
  };

  return metrics;
}

export function initPWAAnalytics(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('appinstalled', () => {
    trackPWAEvent('pwa_installed', getPWAMetrics() || {});
  });

  window.addEventListener('online', () => {
    trackPWAEvent('pwa_online_mode');
  });

  window.addEventListener('offline', () => {
    trackPWAEvent('pwa_offline_mode');
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener('updatefound', () => {
        trackPWAEvent('pwa_update_available');

        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              trackPWAEvent('pwa_update_installed');
            }
          });
        }
      });
    });
  }
}
