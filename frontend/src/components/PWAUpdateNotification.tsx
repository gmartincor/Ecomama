'use client';

import { useTranslations } from 'next-intl';
import { RefreshCw } from 'lucide-react';
import { useServiceWorkerUpdate } from '@/lib/hooks/usePWA';
import { PWA_CONFIG } from '@/lib/pwa-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PWAUpdateNotification() {
  const t = useTranslations('pwa.update');
  const { updateAvailable, updateServiceWorker } = useServiceWorkerUpdate();

  if (!updateAvailable || !PWA_CONFIG.FEATURES.UPDATE_NOTIFICATION) {
    return null;
  }

  return (
    <Card className="fixed top-4 right-4 z-50 max-w-sm border-blue-200 bg-blue-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <RefreshCw className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-blue-900">{t('title')}</h3>
              <p className="mt-1 text-xs text-blue-700">{t('description')}</p>
            </div>
            <Button 
              onClick={updateServiceWorker}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t('button')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
