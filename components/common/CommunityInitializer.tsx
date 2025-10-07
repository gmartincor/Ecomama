"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
          console.error("Failed to fetch user communities");
          setInitialized(true);
          return;
        }

        const communities: Community[] = await communitiesRes.json();
        setUserCommunities(communities);

        if (communities.length === 0) {
          setInitialized(true);
          router.push("/communities/map");
          return;
        }

        const needsUpdate = !activeCommunity || 
                           !activeCommunity.adminId || 
                           !communities.find(c => c.id === activeCommunity.id);

        if (needsUpdate) {
          try {
            const settingsRes = await fetch("/api/users/me/settings");
            const settings = settingsRes.ok ? await settingsRes.json() : null;

            const defaultCommunity = settings?.defaultCommunity
              ? communities.find((c: Community) => c.id === settings.defaultCommunity.id)
              : communities[0];

            if (defaultCommunity) {
              setActiveCommunity(defaultCommunity);
            }
          } catch (error) {
            console.error("Failed to fetch settings, using first community", error);
            setActiveCommunity(communities[0]);
          }
        }
        
        setInitialized(true);
      } catch (error) {
        console.error("Failed to initialize communities", error);
        setInitialized(true);
      }
    };

    initializeCommunities();
  }, [status, session?.user?.id, session?.user?.role]);

  return null;
};
