'use client';

import { useEffect, useState, useCallback } from 'react';
import { isPWAInstalled, shouldShowInstallPrompt, dismissInstallPrompt } from '@/lib/pwa-utils';
import { trackPWAEvent } from '@/lib/pwa-analytics';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Hook to manage PWA installation
 * Provides install prompt functionality and installation state
 * 
 * @returns Object with install state and functions
 * 
 * @example
 * ```tsx
 * const { canInstall, isInstalled, promptInstall } = usePWAInstall();
 * 
 * if (canInstall && !isInstalled) {
 *   return <button onClick={promptInstall}>Install App</button>;
 * }
 * ```
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    setIsInstalled(isPWAInstalled());
    setCanInstall(shouldShowInstallPrompt());

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
      trackPWAEvent('pwa_install_prompt_shown');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
      trackPWAEvent('pwa_installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Show install prompt to user
   */
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        trackPWAEvent('pwa_install_prompt_accepted');
      } else {
        trackPWAEvent('pwa_install_prompt_dismissed');
        dismissInstallPrompt();
      }

      setDeferredPrompt(null);
      setCanInstall(false);
    } catch (error) {
      trackPWAEvent('pwa_install_prompt_dismissed');
    }
  }, [deferredPrompt]);

  /**
   * Dismiss install prompt (don't show again for 30 days)
   */
  const dismissPrompt = useCallback(() => {
    dismissInstallPrompt();
    setCanInstall(false);
    trackPWAEvent('pwa_install_prompt_dismissed');
  }, []);

  return {
    canInstall,
    isInstalled,
    promptInstall,
    dismissPrompt,
  };
}

/**
 * Hook to detect online/offline status
 * 
 * @returns boolean indicating if user is online
 * 
 * @example
 * ```tsx
 * const isOnline = useOnlineStatus();
 * 
 * if (!isOnline) {
 *   return <div>You are offline</div>;
 * }
 * ```
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      trackPWAEvent('pwa_online_mode');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      trackPWAEvent('pwa_offline_mode');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Hook to check if app is installed as PWA
 * 
 * @returns boolean indicating if app is installed
 * 
 * @example
 * ```tsx
 * const isInstalled = useIsPWAInstalled();
 * 
 * if (isInstalled) {
 *   return <div>Thanks for installing our app!</div>;
 * }
 * ```
 */
export function useIsPWAInstalled() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(isPWAInstalled());

    // Listen for app installed event
    const handleAppInstalled = () => setIsInstalled(true);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return isInstalled;
}

/**
 * Hook to manage service worker updates
 * Detects when a new version of the service worker is available
 * 
 * @returns Object with update state and update function
 * 
 * @example
 * ```tsx
 * const { updateAvailable, updateServiceWorker } = useServiceWorkerUpdate();
 * 
 * if (updateAvailable) {
 *   return <button onClick={updateServiceWorker}>Update Available</button>;
 * }
 * ```
 */
export function useServiceWorkerUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.ready.then((reg) => {
      setRegistration(reg);

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setUpdateAvailable(true);
            trackPWAEvent('pwa_update_available');
          }
        });
      });
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      trackPWAEvent('pwa_update_installed');
      window.location.reload();
    });
  }, []);

  /**
   * Update service worker and reload page
   */
  const updateServiceWorker = useCallback(() => {
    if (!registration?.waiting) return;

    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }, [registration]);

  return {
    updateAvailable,
    updateServiceWorker,
  };
}
