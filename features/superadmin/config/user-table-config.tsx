import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "../utils/formatters";
import { getUserStatusVariant, getUserRoleVariant } from "../utils/status-helpers";
import type { SuperadminUser, UserStatus, UserRole } from "../types";
import type { Column, Action } from "../components/data-table";

export const useUserTableConfig = (
  currentUserId: string,
  onUpdateUserStatus: (userId: string, status: UserStatus) => Promise<void>,
  onToggleUserRole: (userId: string, currentRole: UserRole) => Promise<void>
) => {
  const router = useRouter();

  const columns: Column<SuperadminUser>[] = [
    {
      key: "user",
      label: "Usuario",
      render: (user) => (
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
              {user.id === currentUserId && (
                <span className="ml-2 text-xs text-primary font-normal">(Tú)</span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Rol",
      render: (user) => (
        <Badge variant={getUserRoleVariant(user.role)}>{user.role}</Badge>
      ),
    },
    {
      key: "status",
      label: "Estado",
      render: (user) => (
        <Badge variant={getUserStatusVariant(user.status)}>{user.status}</Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Registro",
      render: (user) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
    {
      key: "activity",
      label: "Actividad",
      render: (user) => (
        <div className="space-y-1 text-sm text-muted-foreground">
          <div>🏘️ {user.communitiesCount} comunidades</div>
          <div>📦 {user.listingsCount} publicaciones</div>
          <div>📅 {user.eventsCount} eventos</div>
        </div>
      ),
    },
  ];

  const getActions = (user: SuperadminUser): Action<SuperadminUser>[] => {
    const isCurrentUser = user.id === currentUserId;
    const isSuperadmin = user.role === "SUPERADMIN";

    if (isCurrentUser || isSuperadmin) {
      return [];
    }

    const actions: Action<SuperadminUser>[] = [
      {
        label: user.role === "ADMIN" ? "↓ USER" : "↑ ADMIN",
        variant: "outline",
        onClick: async (u) => onToggleUserRole(u.id, u.role),
      },
    ];

    switch (user.status) {
      case "ACTIVE":
        actions.push(
          {
            label: "Desactivar",
            variant: "outline",
            onClick: async (u) => onUpdateUserStatus(u.id, "INACTIVE"),
          },
          {
            label: "Suspender",
            variant: "destructive",
            onClick: async (u) => onUpdateUserStatus(u.id, "SUSPENDED"),
          }
        );
        break;
      case "INACTIVE":
        actions.push(
          {
            label: "Activar",
            variant: "outline",
            onClick: async (u) => onUpdateUserStatus(u.id, "ACTIVE"),
          },
          {
            label: "Suspender",
            variant: "destructive",
            onClick: async (u) => onUpdateUserStatus(u.id, "SUSPENDED"),
          }
        );
        break;
      case "SUSPENDED":
        actions.push({
          label: "Reactivar",
          variant: "outline",
          onClick: async (u) => onUpdateUserStatus(u.id, "ACTIVE"),
        });
        break;
    }

    return actions;
  };

  return { columns, getActions };
};
