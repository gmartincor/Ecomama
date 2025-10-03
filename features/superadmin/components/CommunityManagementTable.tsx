"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import type { SuperadminCommunity, UpdateCommunityStatusData } from "../types";

interface CommunityManagementTableProps {
  communities: SuperadminCommunity[];
  onUpdateStatus: (communityId: string, data: UpdateCommunityStatusData) => Promise<void>;
}

export function CommunityManagementTable({
  communities,
  onUpdateStatus,
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
    const action = currentStatus === "ACTIVE" ? "desactivar" : "activar";
    if (confirm(`¿Estás seguro de que quieres ${action} esta comunidad?`)) {
      setProcessingId(communityId);
      try {
        const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        await onUpdateStatus(communityId, { 
          status: newStatus as "ACTIVE" | "INACTIVE"
        });
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
    <Card className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Gestión de Comunidades</h2>
        <Input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          {filteredCommunities.length} de {communities.length} comunidades
        </p>
      </div>

      <div className="hidden lg:block overflow-x-auto">
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
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
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
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/community/${community.id}/dashboard`)}
                    >
                      Ver Panel
                    </Button>
                    <Button
                      variant={community.status === "ACTIVE" ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleStatusToggle(community.id, community.status)}
                      disabled={isProcessing}
                    >
                      {community.status === "ACTIVE" ? "Desactivar" : "Activar"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {filteredCommunities.map((community) => {
          const isProcessing = processingId === community.id;

          return (
            <Card key={community.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{community.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {community.city}, {community.country}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2 ${
                      community.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {community.status}
                  </span>
                </div>

                <div 
                  className="cursor-pointer"
                  onClick={() => router.push(`/profile/${community.adminId}`)}
                >
                  <p className="text-xs text-muted-foreground">Administrador</p>
                  <p className="text-sm font-medium">{community.adminName}</p>
                  <p className="text-xs text-gray-500">{community.adminEmail}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Creación</p>
                    <p className="font-medium">{formatDate(community.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estadísticas</p>
                    <div className="space-y-1">
                      <p>👥 {community.membersCount}</p>
                      <p>📦 {community.listingsCount}</p>
                      <p>📅 {community.eventsCount}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/community/${community.id}/dashboard`)}
                    className="w-full"
                  >
                    Ver Panel
                  </Button>
                  <Button
                    variant={community.status === "ACTIVE" ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleStatusToggle(community.id, community.status)}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {community.status === "ACTIVE" ? "Desactivar" : "Activar"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron comunidades
        </div>
      )}
    </Card>
  );
}
