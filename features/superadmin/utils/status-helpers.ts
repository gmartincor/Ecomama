import type { UserStatus, UserRole } from "../types";

type StatusVariant = "success" | "destructive" | "muted";
type RoleVariant = "destructive" | "secondary" | "success";

export const getUserStatusVariant = (status: UserStatus): StatusVariant => {
  const statusMap: Record<UserStatus, StatusVariant> = {
    ACTIVE: "success",
    SUSPENDED: "destructive",
    INACTIVE: "muted",
  };
  return statusMap[status];
};

export const getUserRoleVariant = (role: UserRole): RoleVariant => {
  const roleMap: Record<UserRole, RoleVariant> = {
    SUPERADMIN: "destructive",
    USER: "success",
  };
  return roleMap[role];
};
