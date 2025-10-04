"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProfileWithUser, MemberProfile } from "../types";

export const useProfile = (userId: string) => {
  const [profile, setProfile] = useState<ProfileWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setError("ID de usuario no proporcionado");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${userId}/profile`);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("No tienes permiso para ver este perfil");
        }
        if (response.status === 404) {
          throw new Error("Perfil no encontrado");
        }
        throw new Error(`Error al cargar el perfil (${response.status})`);
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el perfil");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  };
};

export const useCommunityMembers = (communityId: string) => {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!communityId) {
      setError("ID de comunidad no proporcionado");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/communities/${communityId}/members`);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("No tienes permiso para ver los miembros de esta comunidad");
        }
        if (response.status === 404) {
          throw new Error("Comunidad no encontrada");
        }
        throw new Error(`Error al cargar los miembros (${response.status})`);
      }

      const data = await response.json();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los miembros");
    } finally {
      setIsLoading(false);
    }
  }, [communityId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    isLoading,
    error,
    refetch: fetchMembers,
  };
};
