"use client";

import { useParams, useRouter } from "next/navigation";
import { CommunityStats } from "@/features/admin/components";
import { useAdminStats } from "@/features/admin/hooks";

export default function AdminDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const communityId = params?.id as string;
  const { stats, isLoading, error } = useAdminStats(communityId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      {stats && (
        <CommunityStats 
          stats={stats}
          onViewMembers={() => router.push(`/admin/community/${communityId}/members`)}
          onViewPendingRequests={() => router.push(`/community/${communityId}/requests`)}
          onViewOffers={() => router.push(`/listings?communityId=${communityId}&type=OFFER`)}
          onViewDemands={() => router.push(`/listings?communityId=${communityId}&type=DEMAND`)}
        />
      )}
    </div>
  );
}
