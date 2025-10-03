"use client";

import { PageLoading } from "@/components/common";
import { PageError } from "@/components/common";
import { MetricsGrid } from "@/features/superadmin/components/MetricsGrid";
import { useStats } from "@/features/superadmin/hooks/useStats";

export default function SuperadminDashboardPage() {
  const { data: stats, isLoading, error, refetch } = useStats();

  if (isLoading) {
    return <PageLoading title="Panel de Superadministrador" />;
  }

  if (error || !stats) {
    return <PageError message={error || "Error al cargar estadísticas"} onRetry={refetch} />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Panel de Superadministrador</h1>
      <MetricsGrid stats={stats} />
    </div>
  );
}
