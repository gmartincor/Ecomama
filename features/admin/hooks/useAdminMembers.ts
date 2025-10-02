import { useState, useEffect } from "react";
import type { AdminMember } from "../types";

export const useAdminMembers = (communityId: string) => {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    if (!communityId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/community/${communityId}/members`);

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const data = await response.json();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const removeMember = async (userId: string) => {
    const response = await fetch(`/api/admin/community/${communityId}/members/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to remove member");
    }

    await fetchMembers();
  };

  useEffect(() => {
    fetchMembers();
  }, [communityId]);

  return {
    members,
    isLoading,
    error,
    refetch: fetchMembers,
    removeMember,
  };
};
