import { prisma } from "@/lib/prisma/client";
import { getAdminCommunityStats } from "@/lib/services/stats-service";
import type { UpdateCommunityData, AdminMember, CommunityStats } from "../types";

export const getCommunityStats = async (communityId: string): Promise<CommunityStats> => {
  return await getAdminCommunityStats(communityId);
};

export const getAdminMembers = async (communityId: string): Promise<AdminMember[]> => {
  const members = await prisma.communityMember.findMany({
    where: {
      communityId,
      status: "APPROVED",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdListings: {
            where: { communityId },
            select: { id: true },
          },
          createdEvents: {
            where: { communityId },
            select: { id: true },
          },
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });

  return members.map((member) => ({
    id: member.id,
    userId: member.user.id,
    userName: member.user.name,
    userEmail: member.user.email,
    role: member.role,
    status: member.status as "APPROVED" | "REMOVED",
    joinedAt: member.joinedAt?.toISOString() || "",
    listingsCount: member.user.createdListings.length,
    eventsCount: member.user.createdEvents.length,
  }));
};

export const updateCommunity = async (
  communityId: string,
  data: UpdateCommunityData
): Promise<void> => {
  await prisma.community.update({
    where: { id: communityId },
    data: {
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
    },
  });
};

export const removeMember = async (communityId: string, userId: string): Promise<void> => {
  await prisma.communityMember.update({
    where: {
      userId_communityId: {
        userId,
        communityId,
      },
    },
    data: {
      status: "REMOVED",
    },
  });
};

export const isUserCommunityAdmin = async (
  userId: string,
  communityId: string
): Promise<boolean> => {
  const community = await prisma.community.findUnique({
    where: { id: communityId },
    select: { adminId: true },
  });

  return community?.adminId === userId;
};
