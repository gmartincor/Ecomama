"use client";

import { useState, useEffect } from "react";
import { fetchWithError } from "@/lib/utils/fetch-helpers";
import type { CommunityWithRelations, CommunityFilters } from "../types";

export const useCommunities = (filters?: CommunityFilters) => {
  const [communities, setCommunities] = useState<CommunityWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunities = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: Record<string, string | number | undefined> = {};
      
      if (filters?.latitude) params.latitude = filters.latitude;
      if (filters?.longitude) params.longitude = filters.longitude;
      if (filters?.radiusKm) params.radiusKm = filters.radiusKm;
      if (filters?.status) params.status = filters.status;
      if (filters?.search) params.search = filters.search;

      const data = await fetchWithError<CommunityWithRelations[]>(
        '/api/communities',
        { params }
      );
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
    if (!id) {
      setCommunity(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWithError<CommunityWithRelations>(
        `/api/communities/${id}`
      );
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
