"use client";

import { useRouter } from "next/navigation";
import { GlobalStats } from "@/features/superadmin/components";
import { useSuperadminStats } from "@/features/superadmin/hooks";

export default function SuperadminDashboardPage() {
  const router = useRouter();
  const { stats, isLoading, error } = useSuperadminStats();

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
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Panel de Superadministrador</h1>
      {stats && (
        <GlobalStats
          stats={stats}
          onViewUsers={() => router.push("/superadmin/users")}
          onViewCommunities={() => router.push("/superadmin/communities")}
        />
      )}
    </div>
  );
}
