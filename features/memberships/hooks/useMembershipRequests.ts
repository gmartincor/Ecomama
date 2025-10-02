"use client";

import { useState, useEffect, useCallback } from "react";
import type { MemberWithUser, MemberWithCommunity } from "../types";

export const useMembershipRequests = () => {
  const [requests, setRequests] = useState<MemberWithCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/me/requests");

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    error,
    refetch: fetchRequests,
  };
};

export const useAdminRequests = (communityId: string) => {
  const [requests, setRequests] = useState<MemberWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!communityId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/communities/${communityId}/requests`);

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [communityId]);

  const respondToRequest = useCallback(
    async (requestId: string, status: "APPROVED" | "REJECTED", responseMessage?: string) => {
      try {
        const response = await fetch(
          `/api/communities/${communityId}/requests/${requestId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, responseMessage }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to respond to request");
        }

        await fetchRequests();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      }
    },
    [communityId, fetchRequests]
  );

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    error,
    refetch: fetchRequests,
    respondToRequest,
  };
};
