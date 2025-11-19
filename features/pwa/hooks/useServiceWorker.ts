'use client';

import { useEffect, useCallback, useState } from 'react';

export const useServiceWorker = () => {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  const registerServiceWorker = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      setRegistration(reg);

      let isRefreshing = false;

      const handleControllerChange = () => {
        if (isRefreshing) return;
        isRefreshing = true;
        window.location.reload();
      };

      const handleUpdateFound = () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
          }
        });
      };

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      reg.addEventListener('updatefound', handleUpdateFound);

      const checkForUpdates = async () => {
        try {
          await reg.update();
        } catch (error) {
          console.warn('SW update check failed:', error);
        }
      };

      await checkForUpdates();

      const updateInterval = setInterval(checkForUpdates, 60000);

      return () => {
        clearInterval(updateInterval);
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
        reg.removeEventListener('updatefound', handleUpdateFound);
      };
    } catch (error) {
      console.error('SW registration failed:', error);
    }
  }, []);

  useEffect(() => {
    registerServiceWorker();
  }, [registerServiceWorker]);

  return { registration };
};
