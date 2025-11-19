'use client';

import { useServiceWorker } from '@/features/pwa';
import { useEngagement } from '../hooks/useEngagement';
import { OfflineIndicator } from './OfflineIndicator';
import { IOSInstallPrompt } from './IOSInstallPrompt';

export const PWAManager = () => {
  useServiceWorker();
  useEngagement();
  
  return (
    <>
      <OfflineIndicator />
      <IOSInstallPrompt />
    </>
  );
};
