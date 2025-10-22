'use client';

import { useEffect, useState } from 'react';
import { Code, X } from 'lucide-react';
import { getPWAMetrics } from '@/lib/pwa-analytics';
import { useOnlineStatus, useIsPWAInstalled } from '@/lib/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

  const statusItems = [
    { label: 'Online', value: isOnline, type: isOnline ? 'success' : 'error' },
    { label: 'Installed', value: isInstalled, type: isInstalled ? 'success' : 'warning' },
    ...(metrics ? [
      { label: 'Platform', value: metrics.platform, type: 'info' },
      { label: 'Device', value: metrics.deviceType, type: 'info' },
      { label: 'Service Worker', value: metrics.hasServiceWorker, type: metrics.hasServiceWorker ? 'success' : 'error' },
      { label: 'Notifications', value: metrics.hasNotifications, type: metrics.hasNotifications ? 'success' : 'error' },
    ] : [])
  ];

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="fixed bottom-4 right-4 z-[9999] rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
        aria-label="Toggle PWA Dev Tools"
      >
        <Code className="h-5 w-5" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-[9998] w-96 max-h-[600px] overflow-hidden bg-gray-900 text-white border-gray-700">
          <CardHeader className="border-b border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">PWA Dev Tools</CardTitle>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-y-auto max-h-[520px]">
            <div className="p-4 space-y-4">
              <div>
                <h4 className="mb-3 text-sm font-semibold text-purple-400">Status</h4>
                <div className="space-y-2">
                  {statusItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">{item.label}:</span>
                      <Badge 
                        variant={item.type === 'success' ? 'default' : item.type === 'error' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {typeof item.value === 'boolean' ? (item.value ? 'Yes' : 'No') : item.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-purple-400">Events</h4>
                  <Button
                    onClick={() => setEvents([])}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-gray-400 hover:text-white"
                  >
                    Clear
                  </Button>
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
          </CardContent>
        </Card>
      )}
    </>
  );
}
