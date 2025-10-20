/**
 * PWA Utility Functions
 * Provides utility functions for detecting PWA capabilities and environment
 * 
 * @module pwa-utils
 */

/**
 * Check if the app is running in standalone mode (installed PWA)
 * @returns true if running as installed PWA
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Check if the browser supports PWA installation
 * @returns true if PWA installation is supported
 */
export function isPWASupported(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Check if the device is iOS
 * @returns true if running on iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/**
 * Check if the device is Android
 * @returns true if running on Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;

  return /Android/.test(navigator.userAgent);
}

/**
 * Get the device type
 * @returns 'ios' | 'android' | 'desktop' | 'unknown'
 */
export function getDeviceType(): 'ios' | 'android' | 'desktop' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';

  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  if (window.innerWidth >= 768) return 'desktop';
  return 'unknown';
}

/**
 * Check if the app should show install prompt
 * @returns true if install prompt should be shown
 */
export function shouldShowInstallPrompt(): boolean {
  // Don't show if already installed
  if (isPWAInstalled()) return false;

  // Don't show if not supported
  if (!isPWASupported()) return false;

  // Check if user has dismissed the prompt before
  if (typeof window !== 'undefined') {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      
      // Show again after 30 days
      if (daysSinceDismissed < 30) return false;
    }
  }

  return true;
}

/**
 * Mark install prompt as dismissed
 */
export function dismissInstallPrompt(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  }
}

/**
 * Clear dismissed state (for testing)
 */
export function clearInstallPromptDismissed(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pwa-install-dismissed');
  }
}

/**
 * Get service worker registration
 * @returns Promise that resolves to ServiceWorkerRegistration or null
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    return await navigator.serviceWorker.ready;
  } catch (error) {
    console.error('Error getting service worker registration:', error);
    return null;
  }
}

/**
 * Request notification permission
 * @returns Promise that resolves to the permission state
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    return await Notification.requestPermission();
  }

  return Notification.permission;
}

/**
 * Check if notifications are supported and permitted
 * @returns true if notifications are available
 */
export function areNotificationsAvailable(): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  return Notification.permission === 'granted';
}
