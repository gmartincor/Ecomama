"use client";

import { SuperadminNav } from "@/features/superadmin/components";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
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
