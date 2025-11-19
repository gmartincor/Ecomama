'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert('Esta PWA solo puede instalarse desde HTTPS o localhost con un navegador compatible (Chrome/Edge)');
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <Button
      variant={deferredPrompt ? 'accent' : 'ghost'}
      size="sm"
      onClick={handleInstall}
      className="gap-2"
    >
      <span className="text-lg">📱</span>
      <span className="hidden sm:inline">Instalar App</span>
      <span className="sm:hidden">App</span>
    </Button>
  );
};
