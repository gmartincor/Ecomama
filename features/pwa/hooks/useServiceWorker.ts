'use client';

import { useEffect } from 'react';

export const useServiceWorker = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });

        let refreshing = false;

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });

        const checkUpdate = async () => {
          try {
            await registration.update();
          } catch (error) {
            console.error('Update check failed:', error);
          }
        };

        checkUpdate();

        const updateInterval = setInterval(checkUpdate, 60000);

        return () => clearInterval(updateInterval);
      } catch (error) {
        console.error('SW registration failed:', error);
      }
    };

    registerSW();
  }, []);
};
