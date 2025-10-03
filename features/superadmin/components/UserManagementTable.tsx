import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { UserActionButtons } from "./UserActionButtons";
import type { SuperadminUser, UserStatus, UserRole } from "../types";

interface UserManagementTableProps {
  users: SuperadminUser[];
  currentUserId: string;
  onUpdateUserStatus: (userId: string, status: UserStatus) => Promise<void>;
  onToggleUserRole: (userId: string, currentRole: UserRole) => Promise<void>;
}

export function UserManagementTable({
  users,
  currentUserId,
  onUpdateUserStatus,
  onToggleUserRole,
}: UserManagementTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (userId: string, status: UserStatus) => {
    setProcessingId(userId);
    try {
      await onUpdateUserStatus(userId, status);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: UserRole) => {
    setProcessingId(userId);
    try {
      await onToggleUserRole(userId, currentRole);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (status: UserStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "SUSPENDED":
        return "bg-red-100 text-red-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-red-100 text-red-800";
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "USER":
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
        <Input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {filteredUsers.length} de {users.length} usuarios
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rol
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Registro
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actividad
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredUsers.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              const isProcessing = processingId === user.id;
              const canModify = !isCurrentUser && user.role !== "SUPERADMIN";

              return (
                <tr
                  key={user.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => router.push(`/profile/${user.id}`)}
                    >
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">
                          {user.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-primary font-normal">
                              (Tú)
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    <div className="space-y-1">
                      <div>🏘️ {user.communitiesCount} comunidades</div>
                      <div>📦 {user.listingsCount} publicaciones</div>
                      <div>📅 {user.eventsCount} eventos</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {canModify ? (
                      <UserActionButtons
                        userId={user.id}
                        currentStatus={user.status}
                        currentRole={user.role}
                        isProcessing={isProcessing}
                        onStatusChange={handleStatusChange}
                        onRoleToggle={handleRoleToggle}
                      />
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron usuarios
          </div>
        )}
      </div>
    </Card>
  );
}
