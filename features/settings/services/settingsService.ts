import { prisma } from "@/lib/prisma/client";

type UserSettings = {
  userId: string;
  emailNotifications: boolean;
};

const DEFAULT_SETTINGS = {
  emailNotifications: true,
};

export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  const settings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  if (!settings) {
    return {
      userId,
      ...DEFAULT_SETTINGS,
    };
  }

  return {
    userId: settings.userId,
    emailNotifications: settings.emailNotifications,
  };
};

export const updateUserSettings = async (
  userId: string,
  data: {
    emailNotifications?: boolean;
  }
): Promise<UserSettings> => {
  const settings = await prisma.userSettings.upsert({
    where: { userId },
    update: {
      emailNotifications: data.emailNotifications,
    },
    create: {
      userId,
      emailNotifications: data.emailNotifications ?? true,
    },
  });

  return {
    userId: settings.userId,
    emailNotifications: settings.emailNotifications,
  };
};
