'use client';

import { AuthenticatedLayout } from "@/components/layout";
import { ProfileRedirect } from "@/components/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileRedirect>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </ProfileRedirect>
  );
}
