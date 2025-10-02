import { prisma } from "@/lib/prisma/client";
import type {
  GlobalStats,
  SuperadminUser,
  SuperadminCommunity,
  UpdateUserData,
  UpdateCommunityStatusData,
} from "../types";

export const superadminService = {
  async getGlobalStats(): Promise<GlobalStats> {
    const [
      totalUsers,
      totalCommunities,
      totalListings,
      totalEvents,
      activeUsers,
      activeCommunities,
      inactiveCommunities,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.community.count(),
      prisma.listing.count(),
      prisma.event.count(),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.community.count({ where: { status: "ACTIVE" } }),
      prisma.community.count({ where: { status: "INACTIVE" } }),
    ]);

    return {
      totalUsers,
      totalCommunities,
      totalListings,
      totalEvents,
      activeUsers,
      activeCommunities,
      inactiveCommunities,
      totalTransactions: 0,
    };
  },

  async getAllUsers(): Promise<SuperadminUser[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            memberships: true,
            createdListings: true,
            createdEvents: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      communitiesCount: user._count.memberships,
      listingsCount: user._count.createdListings,
      eventsCount: user._count.createdEvents,
    }));
  },

  async getAllCommunities(): Promise<SuperadminCommunity[]> {
    const communities = await prisma.community.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        city: true,
        country: true,
        status: true,
        createdAt: true,
        adminId: true,
        admin: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            members: true,
            listings: true,
            events: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return communities.map((community) => ({
      id: community.id,
      name: community.name,
      description: community.description,
      city: community.city,
      country: community.country,
      status: community.status,
      createdAt: community.createdAt.toISOString(),
      adminId: community.adminId,
      adminName: community.admin.name,
      adminEmail: community.admin.email,
      membersCount: community._count.members,
      listingsCount: community._count.listings,
      eventsCount: community._count.events,
    }));
  },

  async updateUser(userId: string, data: UpdateUserData) {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  },

  async updateCommunityStatus(
    communityId: string,
    data: UpdateCommunityStatusData
  ) {
    return await prisma.community.update({
      where: { id: communityId },
      data: { status: data.status },
    });
  },

  async deleteUser(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { status: "SUSPENDED" },
    });
  },

  async deleteCommunity(communityId: string) {
    return await prisma.community.update({
      where: { id: communityId },
      data: { status: "INACTIVE" },
    });
  },

  async isUserSuperadmin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role === "SUPERADMIN";
  },
};
