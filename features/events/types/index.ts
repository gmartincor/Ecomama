import { Event, EventType } from '@prisma/client';

export type { Event, EventType };

export type EventWithAuthor = Event & {
  author: {
    id: string;
    name: string;
    email: string;
  };
};

export type UserEventWithDetails = {
  id: string;
  title: string;
  description: string;
  type: EventType;
  eventDate: Date | null;
  location: string | null;
  author: {
    id: string;
    name: string;
  };
  registeredAt: Date;
};

export type CreateEventData = {
  type: EventType;
  title: string;
  description: string;
  eventDate?: Date | null;
  location?: string | null;
  latitude?: number;
  longitude?: number;
};

export type UpdateEventData = Partial<CreateEventData>;

export type EventFilters = {
  type?: EventType;
  isPinned?: boolean;
  authorId?: string;
  upcoming?: boolean;
};
