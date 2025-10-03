import { prisma } from "@/lib/prisma/client";

export type BaseCommunityStats = {
  membersCount: number;
  activeListingsCount: number;
  eventsCount: number;
  offersCount: number;
  demandsCount: number;
};

export type AdminCommunityStats = BaseCommunityStats & {
  pendingRequestsCount: number;
};

export const getCommunityStats = async (communityId: string): Promise<BaseCommunityStats> => {
  const [membersCount, listings, eventsCount] = await Promise.all([
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
      where: { communityId },
    }),
  ]);

  const offersCount = listings.filter((l) => l.type === "OFFER").length;
  const demandsCount = listings.filter((l) => l.type === "DEMAND").length;

  return {
    membersCount,
    activeListingsCount: listings.length,
    eventsCount,
    offersCount,
    demandsCount,
  };
};

export const getAdminCommunityStats = async (communityId: string): Promise<AdminCommunityStats> => {
  const [stats, pendingRequestsCount] = await Promise.all([
    getCommunityStats(communityId),
    prisma.communityMember.count({
      where: {
        communityId,
        status: "PENDING",
      },
    }),
  ]);

  return {
    ...stats,
    pendingRequestsCount,
  };
};
