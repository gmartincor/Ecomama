import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import type { AdminMember } from "../types";

interface MemberManagementTableProps {
  members: AdminMember[];
  currentUserId: string;
  onRemoveMember: (userId: string) => Promise<void>;
}

export function MemberManagementTable({
  members,
  currentUserId,
  onRemoveMember,
}: MemberManagementTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const filteredMembers = members.filter(
    (member) =>
      member.userName.toLowerCase().includes(search.toLowerCase()) ||
      member.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemove = async (userId: string) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres remover a este miembro de la comunidad?"
      )
    ) {
      setRemovingId(userId);
      try {
        await onRemoveMember(userId);
      } finally {
        setRemovingId(null);
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
        <h2 className="text-2xl font-bold mb-4">Gestión de Miembros</h2>
        <Input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {filteredMembers.length} de {members.length} miembros
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Miembro
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Ingreso
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
            {filteredMembers.map((member) => {
              const isCurrentUser = member.userId === currentUserId;
              const isRemoving = removingId === member.userId;

              return (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {member.userName.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.userName}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-blue-600 font-normal">
                              (Tú)
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.userEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {member.role === "ADMIN" ? "Administrador" : "Miembro"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(member.joinedAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>📦 {member.listingsCount} publicaciones</div>
                      <div>📅 {member.eventsCount} eventos</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/profile/${member.userId}`)}
                    >
                      Ver Perfil
                    </Button>
                    {!isCurrentUser && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(member.userId)}
                        disabled={isRemoving}
                        className="text-red-600 hover:bg-red-50"
                      >
                        {isRemoving ? "Removiendo..." : "Remover"}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {search
                ? "No se encontraron miembros con ese criterio"
                : "No hay miembros en esta comunidad"}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
