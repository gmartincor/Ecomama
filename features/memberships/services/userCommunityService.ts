import { membershipRepository } from "@/lib/repositories/membership-repository";
import { prisma } from "@/lib/prisma/client";

export const getUserCommunities = async (userId: string) => {
  const [adminCommunities, memberCommunities] = await Promise.all([
    prisma.community.findMany({
      where: { adminId: userId },
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        adminId: true,
      },
    }),
    prisma.communityMember.findMany({
      where: {
        userId,
        status: "APPROVED",
      },
      include: {
        community: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
            adminId: true,
          },
        },
      },
    }),
  ]);

  const memberCommunitiesData = memberCommunities.map((m) => m.community);
  
  const communityMap = new Map();
  
  [...adminCommunities, ...memberCommunitiesData].forEach(community => {
    if (!communityMap.has(community.id)) {
      communityMap.set(community.id, community);
    }
  });

  return Array.from(communityMap.values());
};
