import { useCallback } from "react";
import { useApiData } from "./useApiData";
import type { SuperadminUser, UpdateUserData, UserStatus, UserRole } from "../types";

export const useUsers = () => {
  const { data, isLoading, error, refetch } = useApiData<SuperadminUser[]>({
    endpoint: "/api/superadmin/users",
  });

  const updateUser = useCallback(
    async (userId: string, updateData: UpdateUserData) => {
      const response = await fetch(`/api/superadmin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      await refetch();
    },
    [refetch]
  );

  const updateUserStatus = useCallback(
    async (userId: string, status: UserStatus) => {
      return updateUser(userId, { status });
    },
    [updateUser]
  );

  const toggleUserRole = useCallback(
    async (userId: string, currentRole: UserRole) => {
      const newRole: UserRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
      return updateUser(userId, { role: newRole });
    },
    [updateUser]
  );

  return {
    users: data || [],
    isLoading,
    error,
    updateUser,
    updateUserStatus,
    toggleUserRole,
    refetch,
  };
};
