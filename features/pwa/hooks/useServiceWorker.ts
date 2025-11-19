'use client';

import { useEffect, useCallback } from 'react';

export const useServiceWorker = () => {
  const registerServiceWorker = useCallback(async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      let isRefreshing = false;

      const handleControllerChange = () => {
        if (isRefreshing) return;
        isRefreshing = true;
        window.location.reload();
      };

      const handleUpdateFound = () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      };

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      registration.addEventListener('updatefound', handleUpdateFound);

      const checkForUpdates = async () => {
        try {
          await registration.update();
        } catch (error) {
          console.error('SW update check failed:', error);
        }
      };

      await checkForUpdates();

      const updateInterval = setInterval(checkForUpdates, 60000);

      return () => {
        clearInterval(updateInterval);
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
        registration.removeEventListener('updatefound', handleUpdateFound);
      };
    } catch (error) {
      console.error('SW registration failed:', error);
    }
  }, []);

  useEffect(() => {
    registerServiceWorker();
  }, [registerServiceWorker]);
};
