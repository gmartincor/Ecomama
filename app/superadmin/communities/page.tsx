"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CommunityManagementTable } from "@/features/superadmin/components";
import { useSuperadminCommunities } from "@/features/superadmin/hooks";

export default function CommunitiesListPage() {
  const { communities, isLoading, error, updateCommunityStatus } = useSuperadminCommunities();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando comunidades...</p>
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
    <div className="px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestión de Comunidades</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Administra todas las comunidades de la plataforma
          </p>
        </div>
        <Link href="/superadmin/communities/new" className="w-full sm:w-auto">
          <Button variant="outline" className="bg-card shadow-sm w-full sm:w-auto">
            + Nueva Comunidad
          </Button>
        </Link>
      </div>

      <CommunityManagementTable
        communities={communities}
        onUpdateStatus={updateCommunityStatus}
      />
    </div>
  );
}
