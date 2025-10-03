import { communityRepository } from "@/lib/repositories/community-repository";
import { prisma } from "@/lib/prisma/client";
import type { CommunityWithAdmin, CommunityFilters } from "@/lib/repositories/community-repository";
import type { CreateCommunityInput, UpdateCommunityInput } from "@/lib/validations/community";

export const createCommunity = async (data: CreateCommunityInput, adminId: string) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (user.role === "SUPERADMIN") {
      throw new Error("Un SUPERADMIN no puede ser administrador de una comunidad");
    }

    if (user.role === "USER") {
      await tx.user.update({
        where: { id: adminId },
        data: { role: "ADMIN" },
      });
    }

    return await communityRepository.createCommunity(data, adminId);
  });
};

export const getCommunityById = async (id: string) => {
  return await communityRepository.findByIdWithAdmin(id);
};

export const getAllCommunities = async (filters?: CommunityFilters) => {
  return await communityRepository.findAll(filters || {});
};

export const updateCommunity = async (id: string, data: UpdateCommunityInput) => {
  return await communityRepository.updateCommunity(id, data);
};

export const deleteCommunity = async (id: string) => {
  await communityRepository.delete(id);
};

export const isUserCommunityAdmin = async (userId: string, communityId: string) => {
  return await communityRepository.isUserAdmin(userId, communityId);
};

export type { CommunityWithAdmin as CommunityWithRelations };
