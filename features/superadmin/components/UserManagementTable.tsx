import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import type { SuperadminUser, UpdateUserData } from "../types";

interface UserManagementTableProps {
  users: SuperadminUser[];
  currentUserId: string;
  onUpdateUser: (userId: string, data: UpdateUserData) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export function UserManagementTable({
  users,
  currentUserId,
  onUpdateUser,
  onDeleteUser,
}: UserManagementTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    setProcessingId(userId);
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await onUpdateUser(userId, { 
        status: newStatus as "ACTIVE" | "INACTIVE" | "SUSPENDED"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string) => {
    setProcessingId(userId);
    try {
      const newRole = currentRole === "USER" ? "ADMIN" : "USER";
      await onUpdateUser(userId, { 
        role: newRole as "USER" | "ADMIN" | "SUPERADMIN"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (confirm("¿Estás seguro de que quieres suspender este usuario?")) {
      setProcessingId(userId);
      try {
        await onDeleteUser(userId);
      } finally {
        setProcessingId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registro
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actividad
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredUsers.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              const isProcessing = processingId === user.id;

              return (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => router.push(`/profile/${user.id}`)}
                    >
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-blue-600 font-normal">
                              (Tú)
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "SUPERADMIN"
                          ? "bg-red-100 text-red-800"
                          : user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : user.status === "SUSPENDED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>🏘️ {user.communitiesCount} comunidades</div>
                      <div>📦 {user.listingsCount} publicaciones</div>
                      <div>📅 {user.eventsCount} eventos</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {!isCurrentUser && user.role !== "SUPERADMIN" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRoleChange(user.id, user.role)}
                          disabled={isProcessing}
                        >
                          {user.role === "ADMIN" ? "↓ USER" : "↑ ADMIN"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusToggle(user.id, user.status)}
                          disabled={isProcessing}
                        >
                          {user.status === "ACTIVE" ? "Desactivar" : "Activar"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          disabled={isProcessing || user.status === "SUSPENDED"}
                        >
                          Suspender
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron usuarios
          </div>
        )}
      </div>
    </Card>
  );
}
