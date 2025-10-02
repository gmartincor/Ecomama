"use client";

import { useState, useEffect } from "react";
import type { CommunityWithRelations, CommunityFilters } from "../types";

export const useCommunities = (filters?: CommunityFilters) => {
  const [communities, setCommunities] = useState<CommunityWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunities = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters?.latitude) params.append("latitude", filters.latitude.toString());
      if (filters?.longitude) params.append("longitude", filters.longitude.toString());
      if (filters?.radiusKm) params.append("radiusKm", filters.radiusKm.toString());
      if (filters?.status) params.append("status", filters.status);
      if (filters?.search) params.append("search", filters.search);

      const response = await fetch(`/api/communities?${params}`);

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

  useEffect(() => {
    fetchCommunities();
  }, [JSON.stringify(filters)]);

  return {
    communities,
    isLoading,
    error,
    refetch: fetchCommunities,
  };
};

export const useCommunitiesNearby = (
  latitude?: number,
  longitude?: number,
  radiusKm: number = 50
) => {
  const filters: CommunityFilters | undefined =
    latitude && longitude
      ? {
          latitude,
          longitude,
          radiusKm,
          status: "ACTIVE",
        }
      : undefined;

  return useCommunities(filters);
};

export const useCommunity = (id: string) => {
  const [community, setCommunity] = useState<CommunityWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunity = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/communities/${id}`);

      if (!response.ok) {
        throw new Error("Community not found");
      }

      const data = await response.json();
      setCommunity(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  return {
    community,
    isLoading,
    error,
    refetch: fetchCommunity,
  };
};
