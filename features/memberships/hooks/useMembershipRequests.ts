"use client";

import { useState, useCallback } from "react";
import { useFetch } from "@/lib/hooks";
import type { MemberWithUser, MemberWithCommunity } from "../types";

const getRequestsErrorMessage = (status: number): string => {
  if (status === 403) return "No tienes permiso para ver las solicitudes";
  if (status === 404) return "No se encontraron solicitudes";
  return `Error al cargar las solicitudes (${status})`;
};

export const useMembershipRequests = () => {
  const { data: requests, isLoading, error, refetch } = useFetch<MemberWithCommunity[]>({
    endpoint: "/api/users/me/requests",
    getErrorMessage: getRequestsErrorMessage,
  });

  return {
    requests: requests || [],
    isLoading,
    error,
    refetch,
  };
};

export const useAdminRequests = (communityId: string) => {
  const { data: requests, isLoading, error, refetch } = useFetch<MemberWithUser[]>({
    endpoint: communityId ? `/api/communities/${communityId}/requests` : "",
    autoFetch: !!communityId,
    getErrorMessage: getRequestsErrorMessage,
  });

  const [actionError, setActionError] = useState<string | null>(null);

  const respondToRequest = useCallback(
    async (requestId: string, status: "APPROVED" | "REJECTED", responseMessage?: string) => {
      try {
        setActionError(null);
        const response = await fetch(
          `/api/communities/${communityId}/requests/${requestId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status, responseMessage }),
          }
        );

        if (!response.ok) {
          const errorMsg = response.status === 403
            ? "No tienes permiso para responder a esta solicitud"
            : "Error al responder a la solicitud";
          throw new Error(errorMsg);
        }

        await refetch();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al responder a la solicitud";
        setActionError(errorMessage);
        throw err;
      }
    },
    [communityId, refetch]
  );

  return {
    requests: requests || [],
    isLoading,
    error: error || actionError,
    refetch,
    respondToRequest,
  };
};
