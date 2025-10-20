'use client';

import { useServiceWorkerUpdate } from '@/lib/hooks/usePWA';

/**
 * PWA Update Notification Component
 * Notifies users when a new version of the app is available
 * 
 * Features:
 * - Detects service worker updates
 * - Provides update button
 * - Auto-reloads page after update
 * 
 * @component
 * @example
 * ```tsx
 * <PWAUpdateNotification />
 * ```
 */
export default function PWAUpdateNotification() {
  const { updateAvailable, updateServiceWorker } = useServiceWorkerUpdate();

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-lg">
      <div className="flex items-start gap-3">
        {/* Update Icon */}
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900">
            Update Available
          </h3>
          <p className="mt-1 text-xs text-blue-700">
            A new version of Ecomama is available. Update now to get the latest features and improvements.
          </p>

          {/* Update Button */}
          <button
            onClick={updateServiceWorker}
            className="mt-3 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Now
          </button>
        </div>
      </div>
    </div>
  );
}
