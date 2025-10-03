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
    ADMIN: "secondary",
    USER: "success",
  };
  return roleMap[role];
};

export const getCommunityStatusVariant = (status: "ACTIVE" | "INACTIVE"): StatusVariant => {
  return status === "ACTIVE" ? "success" : "muted";
};
