"use client";

import { useState, useCallback, useEffect } from "react";
import { fetchWithError } from "@/lib/utils/fetch-helpers";
import type { UserListingWithDetails, ListingStatus } from "../types";

type UseUserListingsResult = {
  listings: UserListingWithDetails[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deleteListing: (listingId: string) => Promise<void>;
  updateListingStatus: (listingId: string, status: ListingStatus) => Promise<void>;
};

export const useUserListings = (): UseUserListingsResult => {
  const [listings, setListings] = useState<UserListingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWithError<UserListingWithDetails[]>("/api/users/me/listings");
      setListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteListing = useCallback(async (listingId: string) => {
    try {
      await fetchWithError(`/api/listings/${listingId}`, {
        method: "DELETE",
      });
      
      setListings((prev) => prev.filter((listing) => listing.id !== listingId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al eliminar el anuncio");
    }
  }, []);

  const updateListingStatus = useCallback(async (listingId: string, status: ListingStatus) => {
    try {
      await fetchWithError(`/api/listings/${listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === listingId ? { ...listing, status, updatedAt: new Date() } : listing
        )
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Error al actualizar el estado");
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    const handleFocus = () => {
      fetchListings();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchListings]);

  return {
    listings,
    isLoading,
    error,
    refetch: fetchListings,
    deleteListing,
    updateListingStatus,
  };
};
