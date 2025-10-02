"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { CommunityInitializer } from "./CommunityInitializer";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <CommunityInitializer />
      {children}
    </SessionProvider>
  );
}
