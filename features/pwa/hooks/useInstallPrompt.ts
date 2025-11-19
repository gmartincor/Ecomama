'use client';

import { useEffect, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptState {
  canInstall: boolean;
  isStandalone: boolean;
  promptInstall: () => Promise<boolean>;
  isSecureContext: boolean;
  isSupportedBrowser: boolean;
}

const isBrowserSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const ua = navigator.userAgent.toLowerCase();
  const isChrome = /chrome|crios/.test(ua) && !/edge|edg/.test(ua);
  const isEdge = /edge|edg/.test(ua);
  const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
  
  return isChrome || isEdge || isSafari;
};

export const useInstallPrompt = (): InstallPromptState => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isSecureContext, setIsSecureContext] = useState(false);
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsSecureContext(window.isSecureContext);
    setIsSupportedBrowser(isBrowserSupported());

    const checkStandalone = () => {
      const standalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      
      setIsStandalone(standalone);
    };

    checkStandalone();

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!isSecureContext) {
      alert('Esta PWA solo puede instalarse desde HTTPS o localhost con un navegador compatible (Chrome/Edge)');
      return false;
    }

    if (!isSupportedBrowser) {
      alert('Tu navegador no es compatible. Usa Chrome, Edge o Safari para instalar la app.');
      return false;
    }

    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error durante la instalación:', error);
      return false;
    }
  }, [deferredPrompt, isSecureContext, isSupportedBrowser]);

  return {
    canInstall: !!deferredPrompt && !isStandalone && isSecureContext && isSupportedBrowser,
    isStandalone,
    promptInstall,
    isSecureContext,
    isSupportedBrowser,
  };
};
