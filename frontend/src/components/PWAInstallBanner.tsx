'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, X } from 'lucide-react';
import { usePWAInstall } from '@/lib/hooks/usePWA';
import { isIOS, getDeviceType } from '@/lib/pwa-utils';
import { PWA_CONFIG } from '@/lib/pwa-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface IOSInstructionsDialogProps {
  open: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

function IOSInstructionsDialog({ open, onClose, t }: IOSInstructionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('iosInstructions.title')}</DialogTitle>
        </DialogHeader>
        <ol className="space-y-4 text-sm">
          {[1, 2, 3].map((step) => (
            <li key={step} className="flex items-start gap-3">
              <Badge variant="default" className="h-6 w-6 flex items-center justify-center p-0">
                {step}
              </Badge>
              <span>{t(`iosInstructions.step${step}`)}</span>
            </li>
          ))}
        </ol>
        <Button onClick={onClose} className="w-full">
          {t('iosInstructions.gotIt')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

interface InstallBannerContentProps {
  deviceType: string;
  onInstall: () => void;
  onDismiss: () => void;
  t: (key: string) => string;
}

function InstallBannerContent({ deviceType, onInstall, onDismiss, t }: InstallBannerContentProps) {
  return (
    <Card className="fixed bottom-0 left-0 right-0 z-40 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md rounded-none sm:rounded-lg shadow-lg">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Plus className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h3 className="text-sm font-semibold">{t('title')}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {deviceType === 'ios' ? t('descriptionIOS') : t('description')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={onInstall} size="sm">
                {deviceType === 'ios' ? t('buttonIOS') : t('button')}
              </Button>
              <Button onClick={onDismiss} variant="ghost" size="sm">
                {t('dismiss')}
              </Button>
            </div>
          </div>
          <Button
            onClick={onDismiss}
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function useEngagementTracking(enabled: boolean) {
  const [interactions, setInteractions] = useState(0);
  const [engagementMet, setEngagementMet] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => setEngagementMet(true), PWA_CONFIG.ENGAGEMENT.DELAY_MS);
    const handleInteraction = () => setInteractions((prev) => prev + 1);

    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, [enabled]);

  return { interactions, engagementMet };
}

export default function PWAInstallBanner() {
  const t = useTranslations('pwa.install');
  const { canInstall, isInstalled, promptInstall, dismissPrompt } = usePWAInstall();
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const deviceType = getDeviceType();

  const shouldTrack = canInstall && !isInstalled && PWA_CONFIG.FEATURES.INSTALL_PROMPT;
  const { interactions, engagementMet } = useEngagementTracking(shouldTrack);

  useEffect(() => {
    if (shouldTrack && engagementMet && interactions >= PWA_CONFIG.ENGAGEMENT.MIN_INTERACTIONS) {
      setShowBanner(true);
    }
  }, [shouldTrack, engagementMet, interactions]);

  const handleInstall = () => {
    if (isIOS()) {
      setShowIOSInstructions(true);
    } else {
      promptInstall();
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
    setShowBanner(false);
  };

  const handleCloseInstructions = () => {
    setShowIOSInstructions(false);
    handleDismiss();
  };

  if (!showBanner) return null;

  return (
    <>
      <IOSInstructionsDialog
        open={showIOSInstructions}
        onClose={handleCloseInstructions}
        t={t}
      />
      <InstallBannerContent
        deviceType={deviceType}
        onInstall={handleInstall}
        onDismiss={handleDismiss}
        t={t}
      />
    </>
  );
}
