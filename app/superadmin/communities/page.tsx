"use client";

import { ActionButton } from "@/components/ui/ActionButton";
import { PageLoading, PageError } from "@/components/common";
import { DataTable } from "@/features/superadmin/components/data-table";
import { useCommunities } from "@/features/superadmin/hooks/useCommunities";
import { useCommunityTableConfig } from "@/features/superadmin/config/community-table-config";

export default function CommunitiesListPage() {
  const { communities, isLoading, error, updateCommunityStatus, refetch } = useCommunities();
  const { columns, getActions, mobileCard } = useCommunityTableConfig(updateCommunityStatus);

  if (isLoading) {
    return <PageLoading title="Gestión de Comunidades" />;
  }

  if (error) {
    return <PageError message={error} onRetry={refetch} />;
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
        <ActionButton href="/superadmin/communities/new" className="w-full sm:w-auto">
          + Nueva Comunidad
        </ActionButton>
      </div>

      <DataTable
        data={communities}
        columns={columns}
        actions={(community) => getActions(community)}
        searchable
        searchPlaceholder="Buscar..."
        searchKeys={["name", "city", "adminName"]}
        emptyMessage="No se encontraron comunidades"
        getItemKey={(community) => community.id}
        mobileCard={mobileCard}
      />
    </div>
  );
}
