"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CommunityManagementTable } from "@/features/superadmin/components";
import { useSuperadminCommunities } from "@/features/superadmin/hooks";

export default function CommunitiesListPage() {
  const { communities, isLoading, error, updateCommunityStatus, deleteCommunity } = useSuperadminCommunities();

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
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Comunidades</h1>
          <p className="text-muted-foreground mt-2">
            Administra todas las comunidades de la plataforma
          </p>
        </div>
        <Link href="/superadmin/communities/new">
          <Button>+ Nueva Comunidad</Button>
        </Link>
      </div>

      <CommunityManagementTable
        communities={communities}
        onUpdateStatus={updateCommunityStatus}
        onDelete={deleteCommunity}
      />
    </div>
  );
}
