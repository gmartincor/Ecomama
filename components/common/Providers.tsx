"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { PWARegister } from '@/features/pwa';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <PWARegister />
      {children}
    </SessionProvider>
  );
}
