"use client";

import { useFetch } from "@/lib/hooks";
import type { ProfileWithUser, MemberProfile } from "../types";

const getProfileErrorMessage = (status: number): string => {
  if (status === 403) return "No tienes permiso para ver este perfil";
  if (status === 404) return "Perfil no encontrado";
  return `Error al cargar el perfil (${status})`;
};

const getMembersErrorMessage = (status: number): string => {
  if (status === 403) return "No tienes permiso para ver los miembros de esta comunidad";
  if (status === 404) return "Comunidad no encontrada";
  return `Error al cargar los miembros (${status})`;
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

export const useCommunityMembers = (communityId: string) => {
  const { data: members, isLoading, error, refetch } = useFetch<MemberProfile[]>({
    endpoint: communityId ? `/api/communities/${communityId}/members` : "",
    autoFetch: !!communityId,
    getErrorMessage: getMembersErrorMessage,
  });

  return {
    members: members || [],
    isLoading,
    error,
    refetch,
  };
};
