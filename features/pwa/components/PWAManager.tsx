'use client';

import { useServiceWorker } from '@/features/pwa';
import { useEngagement } from '../hooks/useEngagement';

export const PWAManager = () => {
  useServiceWorker();
  useEngagement();
  return null;
};
