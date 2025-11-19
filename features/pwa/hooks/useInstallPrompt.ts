'use client';

import { useEffect, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptState {
  canInstall: boolean;
  isStandalone: boolean;
  isInstalled: boolean;
  promptInstall: () => Promise<boolean>;
}

const checkIfStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
};

const checkIfInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const installTime = localStorage.getItem('pwa-install-time');
  return !!installTime || checkIfStandalone();
};

export const useInstallPrompt = (): InstallPromptState => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const standalone = checkIfStandalone();
    const installed = checkIfInstalled();
    
    setIsStandalone(standalone);
    setIsInstalled(installed);

    const beforeInstallHandler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const appInstalledHandler = () => {
      localStorage.setItem('pwa-install-time', new Date().toISOString());
      setDeferredPrompt(null);
      setIsStandalone(true);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallHandler);
    window.addEventListener('appinstalled', appInstalledHandler);

    const displayModeQuery = window.matchMedia('(display-mode: standalone)');
    const displayModeHandler = (e: MediaQueryListEvent) => {
      const standalone = e.matches;
      setIsStandalone(standalone);
      if (standalone) {
        localStorage.setItem('pwa-install-time', new Date().toISOString());
        setIsInstalled(true);
      }
    };
    
    displayModeQuery.addEventListener('change', displayModeHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
      displayModeQuery.removeEventListener('change', displayModeHandler);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        localStorage.setItem('pwa-install-time', new Date().toISOString());
        setDeferredPrompt(null);
        setIsInstalled(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Install prompt error:', error);
      return false;
    }
  }, [deferredPrompt]);

  return {
    canInstall: !!deferredPrompt && !isInstalled,
    isStandalone,
    isInstalled,
    promptInstall,
  };
};
