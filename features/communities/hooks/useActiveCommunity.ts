"use client";

import { useCommunityStore } from "@/lib/stores/useCommunityStore";

export const useActiveCommunity = () => {
  const activeCommunity = useCommunityStore((state) => state.activeCommunity);
  const userCommunities = useCommunityStore((state) => state.userCommunities);
  const setActiveCommunity = useCommunityStore((state) => state.setActiveCommunity);

  return {
    activeCommunity,
    userCommunities,
    setActiveCommunity,
    hasActiveCommunity: !!activeCommunity,
    hasCommunities: userCommunities.length > 0,
  };
};
