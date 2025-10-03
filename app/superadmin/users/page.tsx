"use client";

import { useSession } from "next-auth/react";
import { PageLoading, PageError } from "@/components/common";
import { DataTable } from "@/features/superadmin/components/data-table";
import { useUsers } from "@/features/superadmin/hooks/useUsers";
import { useUserTableConfig } from "@/features/superadmin/config/user-table-config";

export default function SuperadminUsersPage() {
  const { data: session } = useSession();
  const { users, isLoading, error, updateUserStatus, toggleUserRole, refetch } = useUsers();
  
  const { columns, getActions } = useUserTableConfig(
    session?.user?.id || "",
    updateUserStatus,
    toggleUserRole
  );

  if (isLoading || !session) {
    return <PageLoading title="Gestión de Usuarios" />;
  }

  if (error) {
    return <PageError message={error} onRetry={refetch} />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-2">
          Administra todos los usuarios de la plataforma
        </p>
      </div>
      <DataTable
        data={users}
        columns={columns}
        actions={(user) => getActions(user)}
        searchable
        searchPlaceholder="Buscar por nombre o email..."
        searchKeys={["name", "email"]}
        emptyMessage="No se encontraron usuarios"
        getItemKey={(user) => user.id}
      />
    </div>
  );
}
