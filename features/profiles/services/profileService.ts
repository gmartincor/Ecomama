import { prisma } from "@/lib/prisma/client";
import type { UserProfile, ProfileWithUser } from "../types";
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

  if (!profile) return null;

  return {
    ...profile,
    user: {
      id: profile.user.id,
      name: profile.user.name,
      email: profile.user.email,
    },
  };
};

export const updateUserProfile = async (
  userId: string,
  data: ProfileInput
): Promise<UserProfile> => {
  const cleanData = {
    bio: data.bio || null,
    phone: data.phone || null,
    location: data.location || null,
    avatar: data.avatar || null,
  };

  return await prisma.userProfile.upsert({
    where: { userId },
    update: cleanData,
    create: {
      userId,
      ...cleanData,
    },
  });
};
