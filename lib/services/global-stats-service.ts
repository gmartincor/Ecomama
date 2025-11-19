import { prisma } from '@/lib/prisma/client';

export type GlobalStats = {
  totalUsers: number;
  activeListings: number;
  upcomingEvents: number;
};

export const getGlobalStats = async (): Promise<GlobalStats> => {
  const [totalUsers, activeListings, upcomingEvents] = await Promise.all([
    prisma.user.count({
      where: {
        status: 'ACTIVE',
        role: 'USER',
      },
    }),
    prisma.listing.count({
      where: {
        status: 'ACTIVE',
      },
    }),
    prisma.event.count({
      where: {
        eventDate: {
          gte: new Date(),
        },
      },
    }),
  ]);

  return {
    totalUsers,
    activeListings,
    upcomingEvents,
  };
};
