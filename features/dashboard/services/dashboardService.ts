import { prisma } from "@/lib/prisma/client";
import type { CommunityStats } from "../types";

export const getCommunityStats = async (communityId: string): Promise<CommunityStats> => {
  const [membersCount, listings, events] = await Promise.all([
    prisma.communityMember.count({
      where: {
        communityId,
        status: "APPROVED",
      },
    }),
    prisma.listing.findMany({
      where: {
        communityId,
        status: "ACTIVE",
      },
      select: {
        type: true,
      },
    }),
    prisma.event.count({
      where: {
        communityId,
      },
    }),
  ]);

  return {
    membersCount,
    activeListingsCount: listings.length,
    eventsCount: events,
  };
};
