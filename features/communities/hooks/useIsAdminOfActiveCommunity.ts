"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useActiveCommunity } from "./useActiveCommunity";

export const useIsAdminOfActiveCommunity = () => {
  const { user } = useAuth();
  const { activeCommunity } = useActiveCommunity();

  if (!activeCommunity || !user) {
    return {
      isAdmin: false,
      communityId: undefined,
    };
  }

  const isAdmin = activeCommunity.adminId === user.id;

  return {
    isAdmin,
    communityId: activeCommunity.id,
  };
};
