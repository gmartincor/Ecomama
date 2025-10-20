'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePWAInstall } from '@/lib/hooks/usePWA';
import { isIOS, getDeviceType } from '@/lib/pwa-utils';
import { PWA_CONFIG } from '@/lib/pwa-config';

export default function PWAInstallBanner() {
  const t = useTranslations('pwa.install');
  const { canInstall, isInstalled, promptInstall, dismissPrompt } = usePWAInstall();
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [interactions, setInteractions] = useState(0);
  const [engagementMet, setEngagementMet] = useState(false);
  const deviceType = getDeviceType();

  useEffect(() => {
    if (!canInstall || isInstalled || !PWA_CONFIG.FEATURES.INSTALL_PROMPT) return;

    const timer = setTimeout(() => setEngagementMet(true), PWA_CONFIG.ENGAGEMENT.DELAY_MS);
    
    const handleInteraction = () => setInteractions((prev) => prev + 1);

    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, [canInstall, isInstalled]);

  useEffect(() => {
    if (canInstall && !isInstalled && engagementMet && interactions >= PWA_CONFIG.ENGAGEMENT.MIN_INTERACTIONS) {
      setShowBanner(true);
    }
  }, [canInstall, isInstalled, engagementMet, interactions]);

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

  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in">
        <div className="max-w-md rounded-lg bg-white p-6 shadow-xl animate-slide-up">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('iosInstructions.title')}
            </h3>
            <button
              onClick={handleCloseInstructions}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ol className="space-y-4 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-600">
                1
              </span>
              <span>{t('iosInstructions.step1')}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-600">
                2
              </span>
              <span>{t('iosInstructions.step2')}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-600">
                3
              </span>
              <span>{t('iosInstructions.step3')}</span>
            </li>
          </ol>

          <button
            onClick={handleCloseInstructions}
            className="mt-6 w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
          >
            {t('iosInstructions.gotIt')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-lg sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:rounded-lg sm:border animate-slide-up">
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* App Icon */}
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">
              {t('title')}
            </h3>
            <p className="mt-1 text-xs text-gray-600">
              {deviceType === 'ios' ? t('descriptionIOS') : t('description')}
            </p>

            {/* Action Buttons */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleInstall}
                className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {deviceType === 'ios' ? t('buttonIOS') : t('button')}
              </button>
              <button
                onClick={handleDismiss}
                className="rounded-md px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {t('dismiss')}
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
