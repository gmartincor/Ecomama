import { prisma } from "@/lib/prisma/client";

type UserSettings = {
  userId: string;
  defaultCommunityId: string | null;
  emailNotifications: boolean;
  defaultCommunity: {
    id: string;
    name: string;
    city: string;
    country: string;
  } | null;
};

const DEFAULT_SETTINGS = {
  defaultCommunityId: null,
  emailNotifications: true,
  defaultCommunity: null,
};

export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  const settings = await prisma.userSettings.findUnique({
    where: { userId },
    include: {
      defaultCommunity: {
        select: {
          id: true,
          name: true,
          city: true,
          country: true,
        },
      },
    },
  });

  if (!settings) {
    return {
      userId,
      ...DEFAULT_SETTINGS,
    };
  }

  return settings;
};

export const updateUserSettings = async (
  userId: string,
  data: {
    defaultCommunityId?: string | null;
    emailNotifications?: boolean;
  }
): Promise<UserSettings> => {
  const updateData: any = {};
  
  if (data.defaultCommunityId !== undefined) {
    updateData.defaultCommunityId = data.defaultCommunityId;
  }
  
  if (data.emailNotifications !== undefined) {
    updateData.emailNotifications = data.emailNotifications;
  }

  return await prisma.userSettings.upsert({
    where: { userId },
    update: updateData,
    create: {
      userId,
      defaultCommunityId: data.defaultCommunityId ?? null,
      emailNotifications: data.emailNotifications ?? true,
    },
    include: {
      defaultCommunity: {
        select: {
          id: true,
          name: true,
          city: true,
          country: true,
        },
      },
    },
  });
};
