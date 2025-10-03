import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "../utils/formatters";
import { getCommunityStatusVariant } from "../utils/status-helpers";
import type { SuperadminCommunity, UpdateCommunityStatusData } from "../types";
import type { Column, Action } from "../components/data-table";

export const useCommunityTableConfig = (
  onUpdateStatus: (communityId: string, data: UpdateCommunityStatusData) => Promise<void>
) => {
  const router = useRouter();

  const columns: Column<SuperadminCommunity>[] = [
    {
      key: "community",
      label: "Comunidad",
      render: (community) => (
        <div>
          <div className="text-sm font-medium text-foreground">{community.name}</div>
          <div className="text-sm text-muted-foreground">
            📍 {community.city}, {community.country}
          </div>
        </div>
      ),
    },
    {
      key: "admin",
      label: "Administrador",
      render: (community) => (
        <div
          className="cursor-pointer"
          onClick={() => router.push(`/profile/${community.adminId}`)}
        >
          <div className="text-sm font-medium text-foreground">{community.adminName}</div>
          <div className="text-sm text-muted-foreground">{community.adminEmail}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Estado",
      render: (community) => (
        <Badge variant={getCommunityStatusVariant(community.status)}>
          {community.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Creación",
      render: (community) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(community.createdAt)}
        </span>
      ),
    },
    {
      key: "stats",
      label: "Estadísticas",
      render: (community) => (
        <div className="space-y-1 text-sm text-muted-foreground">
          <div>👥 {community.membersCount} miembros</div>
          <div>📦 {community.listingsCount} publicaciones</div>
          <div>📅 {community.eventsCount} eventos</div>
        </div>
      ),
    },
  ];

  const getActions = (community: SuperadminCommunity): Action<SuperadminCommunity>[] => [
    {
      label: "Ver Panel",
      variant: "outline",
      onClick: (c) => {
        router.push(`/admin/community/${c.id}/dashboard`);
      },
    },
    {
      label: community.status === "ACTIVE" ? "Desactivar" : "Activar",
      variant: community.status === "ACTIVE" ? "destructive" : "default",
      onClick: async (c) => {
        const newStatus = c.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        await onUpdateStatus(c.id, { status: newStatus });
      },
      confirm: {
        message: (c) => {
          const action = c.status === "ACTIVE" ? "desactivar" : "activar";
          return `¿Estás seguro de que quieres ${action} esta comunidad?`;
        },
      },
    },
  ];

  const mobileCard = (community: SuperadminCommunity) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-base">{community.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            📍 {community.city}, {community.country}
          </p>
        </div>
        <Badge variant={getCommunityStatusVariant(community.status)}>
          {community.status}
        </Badge>
      </div>

      <div
        className="cursor-pointer"
        onClick={() => router.push(`/profile/${community.adminId}`)}
      >
        <p className="text-xs text-muted-foreground">Administrador</p>
        <p className="text-sm font-medium">{community.adminName}</p>
        <p className="text-xs text-muted-foreground">{community.adminEmail}</p>
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
    </div>
  );

  return { columns, getActions, mobileCard };
};
