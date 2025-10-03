"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CommunityInitializer } from "./CommunityInitializer";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";

interface ProvidersProps {
  children: ReactNode;
}

const PUBLIC_ROUTES = ["/", "/login", "/register"];
const STANDALONE_ROUTES = ["/superadmin"];

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isStandaloneRoute = STANDALONE_ROUTES.some(route => pathname.startsWith(route));

  return (
    <SessionProvider>
      <CommunityInitializer />
      {isPublicRoute || isStandaloneRoute ? children : <AuthenticatedLayout>{children}</AuthenticatedLayout>}
    </SessionProvider>
  );
}
