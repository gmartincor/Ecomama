'use client';

import { useEffect, useState } from 'react';
import { getPWAMetrics } from '@/lib/pwa-analytics';
import { useOnlineStatus, useIsPWAInstalled } from '@/lib/hooks/usePWA';

interface PWAEvent {
  event: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export default function PWADevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<PWAEvent[]>([]);
  const [metrics, setMetrics] = useState<ReturnType<typeof getPWAMetrics>>(null);
  const isOnline = useOnlineStatus();
  const isInstalled = useIsPWAInstalled();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const handlePWAEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      setEvents((prev) => [...prev.slice(-19), customEvent.detail]);
    };

    window.addEventListener('pwa-analytics', handlePWAEvent);

    const interval = setInterval(() => {
      setMetrics(getPWAMetrics());
    }, 1000);

    return () => {
      window.removeEventListener('pwa-analytics', handlePWAEvent);
      clearInterval(interval);
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[9999] rounded-full bg-purple-600 p-3 text-white shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Toggle PWA Dev Tools"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-[9998] w-96 max-h-[600px] overflow-hidden rounded-lg bg-gray-900 text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-700 p-4">
            <h3 className="font-semibold">PWA Dev Tools</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="overflow-y-auto max-h-[520px]">
            <div className="border-b border-gray-700 p-4">
              <h4 className="mb-2 text-sm font-semibold text-purple-400">Status</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Online:</span>
                  <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
                    {isOnline ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Installed:</span>
                  <span className={isInstalled ? 'text-green-400' : 'text-yellow-400'}>
                    {isInstalled ? 'Yes' : 'No'}
                  </span>
                </div>
                {metrics && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Platform:</span>
                      <span>{metrics.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Device:</span>
                      <span>{metrics.deviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Service Worker:</span>
                      <span className={metrics.hasServiceWorker ? 'text-green-400' : 'text-red-400'}>
                        {metrics.hasServiceWorker ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Notifications:</span>
                      <span className={metrics.hasNotifications ? 'text-green-400' : 'text-red-400'}>
                        {metrics.hasNotifications ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-purple-400">Events</h4>
                <button
                  onClick={() => setEvents([])}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {events.length === 0 ? (
                  <p className="text-xs text-gray-500">No events yet</p>
                ) : (
                  events.reverse().map((event, i) => (
                    <div key={i} className="rounded bg-gray-800 p-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-green-400">{event.event}</span>
                        <span className="text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {event.metadata && (
                        <pre className="mt-1 text-[10px] text-gray-400 overflow-x-auto">
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
