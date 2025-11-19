'use client';

import { useServiceWorker } from '@/features/pwa';

export const PWAManager = () => {
  useServiceWorker();
  return null;
};
