import { create } from "zustand";
import { persist } from "zustand/middleware";

type Community = {
  id: string;
  name: string;
  city: string;
  country: string;
};

type CommunityStore = {
  activeCommunity: Community | null;
  userCommunities: Community[];
  setActiveCommunity: (community: Community | null) => void;
  setUserCommunities: (communities: Community[]) => void;
  clearCommunityState: () => void;
};

export const useCommunityStore = create<CommunityStore>()(
  persist(
    (set) => ({
      activeCommunity: null,
      userCommunities: [],

      setActiveCommunity: (community) =>
        set({ activeCommunity: community }),

      setUserCommunities: (communities) =>
        set({ userCommunities: communities }),

      clearCommunityState: () =>
        set({ activeCommunity: null, userCommunities: [] }),
    }),
    {
      name: "community-storage",
    }
  )
);
