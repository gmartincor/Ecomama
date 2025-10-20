'use client';

import { useEffect, useState } from 'react';
import { usePWAInstall } from '@/lib/hooks/usePWA';
import { isIOS, getDeviceType } from '@/lib/pwa-utils';

/**
 * PWA Install Banner Component
 * Shows a banner prompting users to install the PWA
 * 
 * Features:
 * - Auto-detects if PWA is installable
 * - Platform-specific instructions (iOS vs Android/Desktop)
 * - Dismissible with 30-day cooldown
 * - Responsive design
 * 
 * @component
 * @example
 * ```tsx
 * <PWAInstallBanner />
 * ```
 */
export default function PWAInstallBanner() {
  const { canInstall, isInstalled, promptInstall, dismissPrompt } = usePWAInstall();
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const deviceType = getDeviceType();

  useEffect(() => {
    // Only show banner if:
    // 1. PWA can be installed
    // 2. PWA is not already installed
    // 3. User hasn't dismissed it recently
    setShowBanner(canInstall && !isInstalled);
  }, [canInstall, isInstalled]);

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

  if (!showBanner) {
    return null;
  }

  // iOS Instructions Modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Install Ecomama on iOS
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
              <span>
                Tap the <strong>Share</strong> button{' '}
                <svg className="inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {' '}in your Safari browser toolbar
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-600">
                2
              </span>
              <span>
                Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>{' '}
                <svg className="inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-600">
                3
              </span>
              <span>
                Tap <strong>&quot;Add&quot;</strong> in the top right corner
              </span>
            </li>
          </ol>

          <button
            onClick={handleCloseInstructions}
            className="mt-6 w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  // Install Banner
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-lg sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:rounded-lg sm:border">
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
              Install Ecomama
            </h3>
            <p className="mt-1 text-xs text-gray-600">
              {deviceType === 'ios' 
                ? 'Add to your home screen for a better experience'
                : 'Install our app for quick access and offline support'
              }
            </p>

            {/* Action Buttons */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleInstall}
                className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {deviceType === 'ios' ? 'How to Install' : 'Install'}
              </button>
              <button
                onClick={handleDismiss}
                className="rounded-md px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Not now
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
