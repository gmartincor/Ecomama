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

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  return (
    <SessionProvider>
      <CommunityInitializer />
      {isPublicRoute ? children : <AuthenticatedLayout>{children}</AuthenticatedLayout>}
    </SessionProvider>
  );
}
