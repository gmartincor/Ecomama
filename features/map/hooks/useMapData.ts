"use client";

import { useState, useEffect } from "react";
import { fetchWithError } from "@/lib/utils/fetch-helpers";
import type { MapEvent, MapListing, MapFilters } from "../types";

type MapData = {
  events: MapEvent[];
  listings: MapListing[];
};

type UseMapDataResult = {
  events: MapEvent[];
  listings: MapListing[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const useMapData = (filters?: MapFilters): UseMapDataResult => {
  const [data, setData] = useState<MapData>({ events: [], listings: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMapData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: Record<string, string | boolean | undefined> = {};
      if (filters?.includeEvents !== undefined) params.includeEvents = filters.includeEvents;
      if (filters?.includeListings !== undefined) params.includeListings = filters.includeListings;
      if (filters?.eventType) params.eventType = filters.eventType;
      if (filters?.listingType) params.listingType = filters.listingType;

      const response = await fetchWithError<MapData>('/api/map/data', { params });
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos del mapa");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, [JSON.stringify(filters)]);

  return {
    events: data.events,
    listings: data.listings,
    isLoading,
    error,
    refetch: fetchMapData,
  };
};
