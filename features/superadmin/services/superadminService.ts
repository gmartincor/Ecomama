import { prisma } from "@/lib/prisma/client";
import type {
  GlobalStats,
  SuperadminUser,
  UpdateUserData,
} from "../types";

export const getGlobalStats = async (): Promise<GlobalStats> => {
  const [
    totalUsers,
    totalListings,
    totalEvents,
    activeUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.event.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
  ]);

  return {
    totalUsers,
    totalListings,
    totalEvents,
    activeUsers,
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
    role: user.role as "USER" | "SUPERADMIN",
    status: user.status as "ACTIVE" | "INACTIVE" | "SUSPENDED",
    createdAt: user.createdAt.toISOString(),
    listingsCount: user._count.createdListings,
    eventsCount: user._count.createdEvents,
  }));
};

export const getSelectableUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["USER", "SUPERADMIN"],
      },
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return users;
};

export const updateUser = async (userId: string, data: UpdateUserData) => {
  return await prisma.user.update({
    where: { id: userId },
    data,
  });
};

export const isUserSuperadmin = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === "SUPERADMIN";
};
