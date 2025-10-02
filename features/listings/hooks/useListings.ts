"use client";

import { useState, useEffect, useCallback } from "react";
import type { Listing, CreateListingData, UpdateListingData, ListingFilters } from "../types";

type UseListingsResult = {
  listings: Listing[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createListing: (data: CreateListingData) => Promise<void>;
  updateListing: (listingId: string, data: UpdateListingData) => Promise<void>;
  deleteListing: (listingId: string) => Promise<void>;
};

export const useListings = (
  communityId: string,
  filters?: ListingFilters
): UseListingsResult => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    if (!communityId) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ communityId });
      if (filters?.type) params.append("type", filters.type);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.authorId) params.append("authorId", filters.authorId);
      if (filters?.search) params.append("search", filters.search);

      const url = `/api/listings?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await response.json();
      setListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [communityId, filters]);

  const createListing = async (data: CreateListingData) => {
    const response = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, communityId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create listing");
    }

    await fetchListings();
  };

  const updateListing = async (listingId: string, data: UpdateListingData) => {
    const response = await fetch(`/api/listings/${listingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update listing");
    }

    await fetchListings();
  };

  const deleteListing = async (listingId: string) => {
    const response = await fetch(`/api/listings/${listingId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete listing");
    }

    await fetchListings();
  };

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    isLoading,
    error,
    refetch: fetchListings,
    createListing,
    updateListing,
    deleteListing,
  };
};
