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
  isSecureContext: boolean;
  isSupportedBrowser: boolean;
}

const isBrowserSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const ua = navigator.userAgent.toLowerCase();
  const isChrome = /chrome|crios/.test(ua) && !/edge|edg/.test(ua);
  const isEdge = /edge|edg/.test(ua);
  const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
  const isAndroid = /android/.test(ua);
  
  return isChrome || isEdge || (isSafari && !isAndroid) || isAndroid;
};

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
  const [isSecureContext, setIsSecureContext] = useState(false);
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsSecureContext(window.isSecureContext);
    setIsSupportedBrowser(isBrowserSupported());

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
    if (!isSecureContext) {
      alert('Esta PWA solo puede instalarse desde HTTPS o localhost');
      return false;
    }

    if (!isSupportedBrowser) {
      const ua = navigator.userAgent.toLowerCase();
      const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
      
      if (isSafari) {
        alert('Para instalar en Safari/iOS:\n1. Toca el botón Compartir\n2. Selecciona "Añadir a pantalla de inicio"');
      } else {
        alert('Tu navegador no soporta instalación automática. Usa Chrome, Edge o Safari.');
      }
      return false;
    }

    if (!deferredPrompt) {
      const ua = navigator.userAgent.toLowerCase();
      const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
      
      if (isSafari) {
        alert('Para instalar en Safari/iOS:\n1. Toca el botón Compartir\n2. Selecciona "Añadir a pantalla de inicio"');
      }
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
      console.error('Error durante la instalación:', error);
      alert('Error al instalar la aplicación. Por favor, intenta de nuevo.');
      return false;
    }
  }, [deferredPrompt, isSecureContext, isSupportedBrowser]);

  return {
    canInstall: !!deferredPrompt && !isInstalled && isSecureContext && isSupportedBrowser,
    isStandalone,
    isInstalled,
    promptInstall,
    isSecureContext,
    isSupportedBrowser,
  };
};
