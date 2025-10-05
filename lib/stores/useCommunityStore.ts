import { create } from "zustand";
import { persist } from "zustand/middleware";

type Community = {
  id: string;
  name: string;
  city: string;
  country: string;
  adminId: string;
};

type CommunityStore = {
  activeCommunity: Community | null;
  userCommunities: Community[];
  isInitialized: boolean;
  setActiveCommunity: (community: Community | null) => void;
  setUserCommunities: (communities: Community[]) => void;
  setInitialized: (initialized: boolean) => void;
  clearCommunityState: () => void;
};

export const useCommunityStore = create<CommunityStore>()(
  persist(
    (set) => ({
      activeCommunity: null,
      userCommunities: [],
      isInitialized: false,

      setActiveCommunity: (community) =>
        set({ activeCommunity: community }),

      setUserCommunities: (communities) =>
        set({ userCommunities: communities }),

      setInitialized: (initialized) =>
        set({ isInitialized: initialized }),

      clearCommunityState: () =>
        set({ activeCommunity: null, userCommunities: [], isInitialized: false }),
    }),
    {
      name: "community-storage",
    }
  )
);
