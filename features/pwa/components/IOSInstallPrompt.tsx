'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

export const IOSInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isStandalone = (window.navigator as any).standalone === true;
    const hasSeenPrompt = localStorage.getItem('ios-install-prompt-seen');

    if (isIOS && !isStandalone && !hasSeenPrompt) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('ios-install-prompt-seen', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 bg-background/95 backdrop-blur border-t border-border shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">🌱</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1">
              Instala Ecomama
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Toca <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
                Compartir
              </span> y luego "Añadir a pantalla de inicio"
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="w-full"
            >
              Entendido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
