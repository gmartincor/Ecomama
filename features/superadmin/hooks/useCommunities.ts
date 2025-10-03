import { useCallback } from "react";
import { useApiData } from "./useApiData";
import type { SuperadminCommunity, UpdateCommunityStatusData } from "../types";

export const useCommunities = () => {
  const { data, isLoading, error, refetch } = useApiData<SuperadminCommunity[]>({
    endpoint: "/api/superadmin/communities",
  });

  const updateCommunityStatus = useCallback(
    async (communityId: string, statusData: UpdateCommunityStatusData) => {
      const response = await fetch(`/api/superadmin/communities/${communityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statusData),
      });

      if (!response.ok) {
        throw new Error("Failed to update community");
      }

      await refetch();
    },
    [refetch]
  );

  return {
    communities: data || [],
    isLoading,
    error,
    updateCommunityStatus,
    refetch,
  };
};
