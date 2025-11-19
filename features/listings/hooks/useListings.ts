"use client";

import { useState, useEffect } from "react";
import { fetchWithError, fetchJSON } from "@/lib/utils/fetch-helpers";
import type { ListingWithAuthor, CreateListingData, UpdateListingData, ListingFilters } from "../types";

type UseListingsResult = {
  listings: ListingWithAuthor[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createListing: (data: CreateListingData) => Promise<void>;
  updateListing: (listingId: string, data: UpdateListingData) => Promise<void>;
  deleteListing: (listingId: string) => Promise<void>;
};

export const useListings = (
  filters?: ListingFilters
): UseListingsResult => {
  const [listings, setListings] = useState<ListingWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: Record<string, string | undefined> = {};
      if (filters?.type) params.type = filters.type;
      if (filters?.status) params.status = filters.status;
      if (filters?.authorId) params.authorId = filters.authorId;
      if (filters?.search) params.search = filters.search;

      const data = await fetchWithError<ListingWithAuthor[]>('/api/listings', { params });
      setListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const createListing = async (data: CreateListingData) => {
    await fetchJSON('/api/listings', data, 'POST');
    await fetchListings();
  };

  const updateListing = async (listingId: string, data: UpdateListingData) => {
    await fetchJSON(`/api/listings/${listingId}`, data, 'PUT');
    await fetchListings();
  };

  const deleteListing = async (listingId: string) => {
    await fetchJSON(`/api/listings/${listingId}`, undefined, 'DELETE');
    await fetchListings();
  };

  useEffect(() => {
    fetchListings();
  }, [filters?.type, filters?.status, filters?.authorId, filters?.search]);

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
