import { prisma } from "@/lib/prisma/client";
import type { UpdateCommunityData, CommunityStats, AdminMember } from "../types";

export const adminService = {
  async getCommunityStats(communityId: string): Promise<CommunityStats> {
    const [
      membersCount,
      pendingRequestsCount,
      listings,
      eventsCount,
    ] = await Promise.all([
      prisma.communityMember.count({
        where: {
          communityId,
          status: "APPROVED",
        },
      }),
      prisma.communityMember.count({
        where: {
          communityId,
          status: "PENDING",
        },
      }),
      prisma.listing.groupBy({
        by: ["type"],
        where: {
          communityId,
          status: "ACTIVE",
        },
        _count: true,
      }),
      prisma.event.count({
        where: { communityId },
      }),
    ]);

    const offersCount = listings.find((l) => l.type === "OFFER")?._count || 0;
    const demandsCount = listings.find((l) => l.type === "DEMAND")?._count || 0;

    return {
      membersCount,
      pendingRequestsCount,
      activeListingsCount: offersCount + demandsCount,
      eventsCount,
      offersCount,
      demandsCount,
    };
  },

  async getAdminMembers(communityId: string): Promise<AdminMember[]> {
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
  },

  async updateCommunity(
    communityId: string,
    data: UpdateCommunityData
  ): Promise<void> {
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
  },

  async removeMember(communityId: string, userId: string): Promise<void> {
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
  },

  async isUserCommunityAdmin(
    userId: string,
    communityId: string
  ): Promise<boolean> {
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      select: { adminId: true },
    });

    return community?.adminId === userId;
  },
};
