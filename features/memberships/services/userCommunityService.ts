import { membershipRepository } from "@/lib/repositories/membership-repository";
import { prisma } from "@/lib/prisma/client";

export const getUserCommunities = async (userId: string) => {
  const memberships = await prisma.communityMember.findMany({
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
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  return memberships.map((m) => m.community);
};
