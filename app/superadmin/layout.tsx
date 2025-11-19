"use client";

import { SuperadminNav } from "@/features/superadmin/components";
import { SuperadminHeader } from "@/components/layout/SuperadminHeader";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SuperadminHeader />
      <div className="flex-1 container mx-auto px-4 pt-24 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <SuperadminNav />
          </aside>
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
