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
  const isMobile = /mobile|android|iphone|ipad|ipod/.test(ua);
  
  return isChrome || isEdge || (isSafari && !isAndroid) || (isAndroid && isMobile);
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

    let promptCaptured = false;

    const beforeInstallHandler = (e: Event) => {
      e.preventDefault();
      promptCaptured = true;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      console.log('PWA: beforeinstallprompt event captured');
    };

    const appInstalledHandler = () => {
      localStorage.setItem('pwa-install-time', new Date().toISOString());
      setDeferredPrompt(null);
      setIsStandalone(true);
      setIsInstalled(true);
      console.log('PWA: App installed successfully');
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

    setTimeout(() => {
      if (!promptCaptured && !installed) {
        console.log('PWA: beforeinstallprompt not fired yet. Browser:', navigator.userAgent);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
      displayModeQuery.removeEventListener('change', displayModeHandler);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    console.log('PWA: promptInstall called', {
      hasPrompt: !!deferredPrompt,
      isSecureContext,
      isSupportedBrowser,
      isInstalled,
      userAgent: navigator.userAgent
    });

    if (!isSecureContext) {
      alert('Esta PWA solo puede instalarse desde HTTPS o localhost');
      return false;
    }

    if (!isSupportedBrowser) {
      const ua = navigator.userAgent.toLowerCase();
      const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
      
      if (isSafari) {
        alert('Para instalar en Safari/iOS:\n1. Toca el botón Compartir (icono compartir)\n2. Selecciona "Añadir a pantalla de inicio"\n3. Toca "Añadir"');
      } else {
        alert('Tu navegador no soporta instalación automática. Usa Chrome, Edge o Safari.');
      }
      return false;
    }

    if (!deferredPrompt) {
      const ua = navigator.userAgent.toLowerCase();
      const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
      const isChromeMobile = /chrome/.test(ua) && /mobile|android/.test(ua);
      
      if (isSafari) {
        alert('Para instalar en Safari/iOS:\n1. Toca el botón Compartir (icono compartir)\n2. Selecciona "Añadir a pantalla de inicio"\n3. Toca "Añadir"');
      } else if (isChromeMobile) {
        alert('Para instalar esta app:\n\n1. Asegúrate de estar en una conexión segura (HTTPS)\n2. Navega por la app unos segundos\n3. El navegador te mostrará automáticamente la opción de instalar\n\nO usa el menú de Chrome (⋮) → "Añadir a pantalla de inicio"');
      } else {
        alert('El navegador aún no ha habilitado la instalación. Por favor:\n\n1. Navega por la app unos segundos\n2. Interactúa con el contenido\n3. Vuelve a intentar\n\nO usa el menú del navegador → "Instalar app"');
      }
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log('PWA: User choice outcome:', outcome);

      if (outcome === 'accepted') {
        localStorage.setItem('pwa-install-time', new Date().toISOString());
        setDeferredPrompt(null);
        setIsInstalled(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error durante la instalación:', error);
      alert('Error al instalar la aplicación. Por favor:\n\n1. Intenta de nuevo en unos segundos\n2. O usa el menú del navegador (⋮) → "Instalar app"');
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
