import { prisma } from '@/lib/prisma/client';
import { AttendeeStatus, EventAttendee } from '@prisma/client';
import type { UserEventWithDetails } from '../types';

export const registerForEvent = async (
  userId: string,
  eventId: string
): Promise<EventAttendee> => {
  return await prisma.eventAttendee.upsert({
    where: {
      eventId_userId: { eventId, userId },
    },
    update: {
      status: AttendeeStatus.REGISTERED,
      updatedAt: new Date(),
    },
    create: {
      eventId,
      userId,
      status: AttendeeStatus.REGISTERED,
    },
  });
};

export const cancelEventRegistration = async (
  userId: string,
  eventId: string
): Promise<EventAttendee> => {
  return await prisma.eventAttendee.update({
    where: {
      eventId_userId: { eventId, userId },
    },
    data: {
      status: AttendeeStatus.CANCELLED,
    },
  });
};

export const getUserEvents = async (userId: string): Promise<UserEventWithDetails[]> => {
  const attendances = await prisma.eventAttendee.findMany({
    where: {
      userId,
      status: AttendeeStatus.REGISTERED,
      event: {
        eventDate: {
          gte: new Date(),
        },
      },
    },
    include: {
      event: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      event: {
        eventDate: 'asc',
      },
    },
  });

  return attendances.map((attendance) => ({
    id: attendance.event.id,
    title: attendance.event.title,
    description: attendance.event.description,
    type: attendance.event.type,
    eventDate: attendance.event.eventDate,
    location: attendance.event.location,
    author: attendance.event.author,
    registeredAt: attendance.createdAt,
  }));
};

export const isUserRegistered = async (
  userId: string,
  eventId: string
): Promise<boolean> => {
  const attendance = await prisma.eventAttendee.findUnique({
    where: {
      eventId_userId: { eventId, userId },
    },
  });

  return attendance?.status === AttendeeStatus.REGISTERED;
};

export const getEventAttendeesCount = async (eventId: string): Promise<number> => {
  return await prisma.eventAttendee.count({
    where: {
      eventId,
      status: AttendeeStatus.REGISTERED,
    },
  });
};
