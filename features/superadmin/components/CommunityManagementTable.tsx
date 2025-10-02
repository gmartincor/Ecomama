import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import type { SuperadminCommunity, UpdateCommunityStatusData } from "../types";

interface CommunityManagementTableProps {
  communities: SuperadminCommunity[];
  onUpdateStatus: (communityId: string, data: UpdateCommunityStatusData) => Promise<void>;
  onDelete: (communityId: string) => Promise<void>;
}

export function CommunityManagementTable({
  communities,
  onUpdateStatus,
  onDelete,
}: CommunityManagementTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(search.toLowerCase()) ||
      community.city.toLowerCase().includes(search.toLowerCase()) ||
      community.adminName.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusToggle = async (communityId: string, currentStatus: string) => {
    setProcessingId(communityId);
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await onUpdateStatus(communityId, { 
        status: newStatus as "ACTIVE" | "INACTIVE"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (communityId: string) => {
    if (confirm("¿Estás seguro de que quieres desactivar esta comunidad?")) {
      setProcessingId(communityId);
      try {
        await onDelete(communityId);
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
        <h2 className="text-2xl font-bold mb-4">Gestión de Comunidades</h2>
        <Input
          type="text"
          placeholder="Buscar por nombre, ciudad o administrador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {filteredCommunities.length} de {communities.length} comunidades
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comunidad
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Administrador
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creación
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estadísticas
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCommunities.map((community) => {
              const isProcessing = processingId === community.id;

              return (
                <tr
                  key={community.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {community.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        📍 {community.city}, {community.country}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div
                      className="cursor-pointer"
                      onClick={() => router.push(`/profile/${community.adminId}`)}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {community.adminName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {community.adminEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        community.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {community.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(community.createdAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>👥 {community.membersCount} miembros</div>
                      <div>📦 {community.listingsCount} publicaciones</div>
                      <div>📅 {community.eventsCount} eventos</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/community/${community.id}/dashboard`)}
                    >
                      Ver Panel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusToggle(community.id, community.status)}
                      disabled={isProcessing}
                    >
                      {community.status === "ACTIVE" ? "Desactivar" : "Activar"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(community.id)}
                      disabled={isProcessing || community.status === "INACTIVE"}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCommunities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron comunidades
          </div>
        )}
      </div>
    </Card>
  );
}
