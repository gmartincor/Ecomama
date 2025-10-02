import { useState, useEffect } from "react";
import type { SuperadminUser, UpdateUserData } from "../types";

export const useSuperadminUsers = () => {
  const [users, setUsers] = useState<SuperadminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/superadmin/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userId: string, data: UpdateUserData) => {
    try {
      const response = await fetch(`/api/superadmin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/superadmin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
};
