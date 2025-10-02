import { prisma } from "@/lib/prisma/client";
import type { Community, CommunityWithRelations, CommunityFilters } from "../types";
import type { CreateCommunityInput, UpdateCommunityInput } from "@/lib/validations/community";

const EARTH_RADIUS_KM = 6371;

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

export const createCommunity = async (
  data: CreateCommunityInput,
  adminId: string
): Promise<Community> => {
  return await prisma.community.create({
    data: {
      ...data,
      adminId,
    },
  });
};

export const getCommunityById = async (id: string): Promise<CommunityWithRelations | null> => {
  return await prisma.community.findUnique({
    where: { id },
    include: {
      admin: {
        select: {
          id: true,
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
  });
};

export const getAllCommunities = async (
  filters?: CommunityFilters
): Promise<CommunityWithRelations[]> => {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { city: { contains: filters.search, mode: "insensitive" } },
      { country: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const communities = await prisma.community.findMany({
    where,
    include: {
      admin: {
        select: {
          id: true,
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

  if (filters?.latitude && filters?.longitude && filters?.radiusKm) {
    return communities.filter((community: CommunityWithRelations) => {
      const distance = calculateDistance(
        filters.latitude!,
        filters.longitude!,
        community.latitude,
        community.longitude
      );
      return distance <= filters.radiusKm!;
    });
  }

  return communities;
};

export const updateCommunity = async (
  id: string,
  data: UpdateCommunityInput
): Promise<Community> => {
  return await prisma.community.update({
    where: { id },
    data,
  });
};

export const deleteCommunity = async (id: string): Promise<void> => {
  await prisma.community.delete({
    where: { id },
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
