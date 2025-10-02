import { prisma } from "@/lib/prisma/client";
import type { UserProfile, ProfileWithUser, MemberProfile } from "../types";
import type { ProfileInput } from "@/lib/validations/profile";

export const getUserProfile = async (userId: string): Promise<ProfileWithUser | null> => {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return profile;
};

export const updateUserProfile = async (
  userId: string,
  data: ProfileInput
): Promise<UserProfile> => {
  return await prisma.userProfile.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });
};

export const getCommunityMembers = async (communityId: string): Promise<MemberProfile[]> => {
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
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  const memberProfiles = await Promise.all(
    members.map(async (member: any) => {
      const profile = await prisma.userProfile.findUnique({
        where: { userId: member.userId },
      });

      return {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        profile,
        memberSince: member.joinedAt || member.requestedAt,
      };
    })
  );

  return memberProfiles;
};

export const canViewProfile = async (
  viewerId: string,
  profileOwnerId: string
): Promise<boolean> => {
  if (viewerId === profileOwnerId) {
    return true;
  }

  const sharedCommunities = await prisma.communityMember.findFirst({
    where: {
      userId: viewerId,
      status: "APPROVED",
      community: {
        members: {
          some: {
            userId: profileOwnerId,
            status: "APPROVED",
          },
        },
      },
    },
  });

  return !!sharedCommunities;
};
