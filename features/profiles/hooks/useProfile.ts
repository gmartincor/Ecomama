"use client";

import { useFetch } from "@/lib/hooks";
import type { ProfileWithUser } from "../types";

const getProfileErrorMessage = (status: number): string => {
  if (status === 403) return "No tienes permiso para ver este perfil";
  if (status === 404) return "Perfil no encontrado";
  return `Error al cargar el perfil (${status})`;
};

export const useProfile = (userId: string) => {
  const { data: profile, isLoading, error, refetch } = useFetch<ProfileWithUser>({
    endpoint: userId ? `/api/users/${userId}/profile` : "",
    autoFetch: !!userId,
    getErrorMessage: getProfileErrorMessage,
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
  };
};
