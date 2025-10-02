import { prisma } from "@/lib/prisma/client";
import type { Event, CreateEventData, UpdateEventData, EventFilters } from "../types";

export const getEvents = async (
  communityId: string,
  filters?: EventFilters
): Promise<Event[]> => {
  const events = await prisma.event.findMany({
    where: {
      communityId,
      ...(filters?.type && { type: filters.type }),
      ...(filters?.isPinned !== undefined && { isPinned: filters.isPinned }),
      ...(filters?.authorId && { authorId: filters.authorId }),
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: [
      { isPinned: "desc" },
      { createdAt: "desc" },
    ],
  });

  return events;
};

export const getEventById = async (eventId: string): Promise<Event | null> => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return event;
};

export const createEvent = async (
  communityId: string,
  authorId: string,
  data: CreateEventData
): Promise<Event> => {
  const event = await prisma.event.create({
    data: {
      communityId,
      authorId,
      type: data.type,
      title: data.title,
      description: data.description,
      eventDate: data.eventDate || null,
      location: data.location || null,
      isPinned: false,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return event;
};

export const updateEvent = async (
  eventId: string,
  data: UpdateEventData
): Promise<Event> => {
  const event = await prisma.event.update({
    where: { id: eventId },
    data: {
      ...(data.type && { type: data.type }),
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.eventDate !== undefined && { eventDate: data.eventDate }),
      ...(data.location !== undefined && { location: data.location }),
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return event;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  await prisma.event.delete({
    where: { id: eventId },
  });
};

export const togglePinEvent = async (
  eventId: string,
  isPinned: boolean
): Promise<Event> => {
  const event = await prisma.event.update({
    where: { id: eventId },
    data: { isPinned },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return event;
};

export const isUserAdminOfEventCommunity = async (
  userId: string,
  eventId: string
): Promise<boolean> => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      community: {
        select: {
          adminId: true,
        },
      },
    },
  });

  if (!event) return false;

  return event.community.adminId === userId;
};
