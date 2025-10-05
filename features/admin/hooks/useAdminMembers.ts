import { useState, useEffect } from "react";
import { fetchWithError, fetchJSON } from "@/lib/utils/fetch-helpers";
import type { AdminMember } from "../types";

export const useAdminMembers = (communityId: string) => {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    if (!communityId) {
      setMembers([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWithError<AdminMember[]>(
        `/api/admin/community/${communityId}/members`
      );
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const removeMember = async (userId: string) => {
    await fetchJSON(
      `/api/admin/community/${communityId}/members/${userId}`,
      undefined,
      'DELETE'
    );
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
