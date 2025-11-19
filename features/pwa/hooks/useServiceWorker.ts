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

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              if (window.confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
                window.location.reload();
              }
            }
          });
        });

        await registration.update();
      } catch (error) {
        console.error('SW registration failed:', error);
      }
    };

    registerSW();
  }, []);
};
