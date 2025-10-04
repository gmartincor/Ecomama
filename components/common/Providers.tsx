"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CommunityInitializer } from "./CommunityInitializer";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { ROUTE_CONFIG, isRouteMatch } from "@/lib/auth/route-config";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const isPublicRoute = isRouteMatch(pathname, ROUTE_CONFIG.public);
  const isStandaloneRoute = isRouteMatch(pathname, ROUTE_CONFIG.superadmin);

  return (
    <SessionProvider>
      <CommunityInitializer />
      {isPublicRoute || isStandaloneRoute ? children : <AuthenticatedLayout>{children}</AuthenticatedLayout>}
    </SessionProvider>
  );
}
