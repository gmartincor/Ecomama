"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCommunityStore } from "@/lib/stores/useCommunityStore";

type Community = {
  id: string;
  name: string;
  city: string;
  country: string;
  adminId: string;
};

export const CommunityInitializer = () => {
  const { data: session, status } = useSession();
  const { setUserCommunities, setActiveCommunity, activeCommunity, setInitialized } = useCommunityStore();

  useEffect(() => {
    const initializeCommunities = async () => {
      if (status === "loading") {
        return;
      }

      if (status === "unauthenticated") {
        setInitialized(true);
        return;
      }

      if (!session?.user) {
        setInitialized(true);
        return;
      }

      if (session.user.role === "SUPERADMIN") {
        setInitialized(true);
        return;
      }

      try {
        const communitiesRes = await fetch("/api/users/me/communities");

        if (!communitiesRes.ok) {
          setInitialized(true);
          return;
        }

        const communities: Community[] = await communitiesRes.json();
        setUserCommunities(communities);

        const needsUpdate = !activeCommunity || 
                           !activeCommunity.adminId || 
                           !communities.find(c => c.id === activeCommunity.id);

        if (needsUpdate && communities.length > 0) {
          try {
            const settingsRes = await fetch("/api/users/me/settings");
            const settings = settingsRes.ok ? await settingsRes.json() : null;

            const defaultCommunity = settings?.defaultCommunity
              ? communities.find((c: Community) => c.id === settings.defaultCommunity.id)
              : communities[0];

            if (defaultCommunity) {
              setActiveCommunity(defaultCommunity);
            }
          } catch {
            setActiveCommunity(communities[0]);
          }
        }
        
        setInitialized(true);
      } catch {
        setInitialized(true);
      }
    };

    initializeCommunities();
  }, [status, session?.user?.id, session?.user?.role, setUserCommunities, setActiveCommunity, activeCommunity, setInitialized]);

  return null;
};
