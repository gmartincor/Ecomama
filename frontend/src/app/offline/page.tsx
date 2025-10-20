import Link from 'next/link';

/**
 * Offline Fallback Page
 * Displayed when the user is offline and attempts to access a non-cached page
 * 
 * This page should be simple, self-contained, and not rely on external resources
 * 
 * @page /offline
 */
export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="text-center">
        {/* Offline Icon - Inline SVG for reliability */}
        <div className="mb-8 flex justify-center">
          <svg
            className="h-24 w-24 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        {/* Main Message */}
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          You&apos;re Offline
        </h1>
        
        <p className="mb-8 max-w-md text-lg text-gray-600">
          It looks like you&apos;ve lost your internet connection. 
          Please check your network and try again.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="rounded-lg border-2 border-green-600 px-6 py-3 font-semibold text-green-600 transition-colors hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Go Home
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 rounded-lg bg-green-50 p-6 text-left">
          <h2 className="mb-3 font-semibold text-gray-900">
            💡 While You&apos;re Offline
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Previously viewed pages may still be accessible</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Your app will automatically sync when you&apos;re back online</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Check your WiFi or mobile data connection</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-500">
        <p>
          Ecomama - Connecting farmers and consumers 🌱
        </p>
      </footer>
    </div>
  );
}

/**
 * Static metadata for the offline page
 */
export const metadata = {
  title: 'Offline',
  description: 'You are currently offline. Please check your internet connection.',
};
