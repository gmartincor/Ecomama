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
};

export const CommunityInitializer = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setUserCommunities, setActiveCommunity, activeCommunity } = useCommunityStore();

  useEffect(() => {
    const initializeCommunities = async () => {
      if (status !== "authenticated" || !session?.user) {
        return;
      }

      try {
        const [communitiesRes, settingsRes] = await Promise.all([
          fetch("/api/users/me/communities"),
          fetch("/api/users/me/settings"),
        ]);

        if (!communitiesRes.ok || !settingsRes.ok) {
          return;
        }

        const communities: Community[] = await communitiesRes.json();
        const settings = await settingsRes.json();

        setUserCommunities(communities);

        if (communities.length === 0) {
          router.push("/communities/map");
          return;
        }

        if (!activeCommunity) {
          const defaultCommunity = settings.defaultCommunity
            ? communities.find((c: Community) => c.id === settings.defaultCommunity.id)
            : communities[0];

          if (defaultCommunity) {
            setActiveCommunity(defaultCommunity);
          }
        }
      } catch (error) {
        console.error("Failed to initialize communities", error);
      }
    };

    initializeCommunities();
  }, [status, session, setUserCommunities, setActiveCommunity, activeCommunity, router]);

  return null;
};
