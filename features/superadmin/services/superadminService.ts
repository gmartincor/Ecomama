import { prisma } from "@/lib/prisma/client";
import type {
  GlobalStats,
  SuperadminUser,
  SuperadminCommunity,
  UpdateUserData,
  UpdateCommunityStatusData,
} from "../types";

export const getGlobalStats = async (): Promise<GlobalStats> => {
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
};

export const getAllUsers = async (): Promise<SuperadminUser[]> => {
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
};

export const getAllCommunities = async (): Promise<SuperadminCommunity[]> => {
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
};

export const updateUser = async (userId: string, data: UpdateUserData) => {
  return await prisma.user.update({
    where: { id: userId },
    data,
  });
};

export const updateCommunityStatus = async (
  communityId: string,
  data: UpdateCommunityStatusData
) => {
  return await prisma.community.update({
    where: { id: communityId },
    data: { status: data.status },
  });
};

export const deleteUser = async (userId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { status: "SUSPENDED" },
  });
};

export const isUserSuperadmin = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === "SUPERADMIN";
};
