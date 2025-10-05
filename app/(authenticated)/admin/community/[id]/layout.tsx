"use client";

import { useParams } from "next/navigation";
import { AdminNav } from "@/features/admin/components";

export default function AdminCommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const communityId = params?.id as string;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <AdminNav communityId={communityId} />
          </aside>
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
