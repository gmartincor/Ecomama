import { useState, useEffect } from "react";
import type { SuperadminCommunity, UpdateCommunityStatusData } from "../types";

export const useSuperadminCommunities = () => {
  const [communities, setCommunities] = useState<SuperadminCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunities = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/superadmin/communities");

      if (!response.ok) {
        throw new Error("Failed to fetch communities");
      }

      const data = await response.json();
      setCommunities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const updateCommunityStatus = async (
    communityId: string,
    data: UpdateCommunityStatusData
  ) => {
    try {
      const response = await fetch(`/api/superadmin/communities/${communityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update community");
      }

      await fetchCommunities();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return {
    communities,
    isLoading,
    error,
    updateCommunityStatus,
    refetch: fetchCommunities,
  };
};
