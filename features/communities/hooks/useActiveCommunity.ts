"use client";

import { useCommunityStore } from "@/lib/stores/useCommunityStore";

export const useActiveCommunity = () => {
  const activeCommunity = useCommunityStore((state) => state.activeCommunity);
  const userCommunities = useCommunityStore((state) => state.userCommunities);
  const isInitialized = useCommunityStore((state) => state.isInitialized);
  const setActiveCommunity = useCommunityStore((state) => state.setActiveCommunity);

  return {
    activeCommunity,
    userCommunities,
    isInitialized,
    setActiveCommunity,
    hasActiveCommunity: !!activeCommunity,
    hasCommunities: userCommunities.length > 0,
  };
};
