"use client";

import { useState, useEffect } from "react";
import type { CommunityStats } from "../types";

export const useCommunityStats = (communityId: string) => {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!communityId) {
      setStats(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/communities/${communityId}/stats`);

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [communityId]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};
