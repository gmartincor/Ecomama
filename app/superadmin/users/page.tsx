"use client";

import { useSession } from "next-auth/react";
import { UserManagementTable } from "@/features/superadmin/components";
import { useSuperadminUsers } from "@/features/superadmin/hooks";

export default function SuperadminUsersPage() {
  const { data: session } = useSession();
  const { users, isLoading, error, updateUser, deleteUser } = useSuperadminUsers();

  if (isLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando usuarios...</p>
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-2">
          Administra todos los usuarios de la plataforma
        </p>
      </div>
      <UserManagementTable
        users={users}
        currentUserId={session.user.id}
        onUpdateUser={updateUser}
        onDeleteUser={deleteUser}
      />
    </div>
  );
}
