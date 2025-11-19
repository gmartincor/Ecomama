'use client';

import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-warning text-warning-foreground px-4 py-2 text-center text-sm font-medium shadow-lg">
      <div className="flex items-center justify-center gap-2">
        <span className="text-lg">📡</span>
        <span>Sin conexión a internet - Modo offline</span>
      </div>
    </div>
  );
};
