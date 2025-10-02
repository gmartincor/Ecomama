import { prisma } from "@/lib/prisma/client";
import type { MemberWithUser, MemberWithCommunity, CommunityMember } from "../types";

export const createMembershipRequest = async (
  userId: string,
  communityId: string,
  message: string
): Promise<CommunityMember> => {
  const existingMembership = await prisma.communityMember.findFirst({
    where: {
      userId,
      communityId,
      status: {
        in: ["PENDING", "APPROVED"],
      },
    },
  });

  if (existingMembership) {
    throw new Error("You already have an active request or membership");
  }

  return await prisma.communityMember.create({
    data: {
      userId,
      communityId,
      requestMessage: message,
      status: "PENDING",
      role: "MEMBER",
      requestedAt: new Date(),
    },
  });
};

export const getMembershipRequestsByUser = async (userId: string): Promise<MemberWithCommunity[]> => {
  return await prisma.communityMember.findMany({
    where: { userId },
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
    orderBy: { requestedAt: "desc" },
  });
};

export const getPendingRequestsByCommunity = async (
  communityId: string
): Promise<MemberWithUser[]> => {
  return await prisma.communityMember.findMany({
    where: {
      communityId,
      status: "PENDING",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { requestedAt: "asc" },
  });
};

export const approveMembershipRequest = async (
  requestId: string,
  responseMessage?: string
): Promise<CommunityMember> => {
  return await prisma.communityMember.update({
    where: { id: requestId },
    data: {
      status: "APPROVED",
      responseMessage,
      respondedAt: new Date(),
      joinedAt: new Date(),
    },
  });
};

export const rejectMembershipRequest = async (
  requestId: string,
  responseMessage?: string
): Promise<CommunityMember> => {
  return await prisma.communityMember.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
      responseMessage,
      respondedAt: new Date(),
    },
  });
};

export const getUserApprovedCommunities = async (userId: string): Promise<string[]> => {
  const memberships = await prisma.communityMember.findMany({
    where: {
      userId,
      status: "APPROVED",
    },
    select: {
      communityId: true,
    },
  });

  return memberships.map((m: { communityId: string }) => m.communityId);
};

export const isUserMemberOfCommunity = async (
  userId: string,
  communityId: string
): Promise<boolean> => {
  const membership = await prisma.communityMember.findFirst({
    where: {
      userId,
      communityId,
      status: "APPROVED",
    },
  });

  return !!membership;
};

export const getUserMembershipInCommunity = async (
  userId: string,
  communityId: string
): Promise<CommunityMember | null> => {
  return await prisma.communityMember.findFirst({
    where: {
      userId,
      communityId,
    },
  });
};
