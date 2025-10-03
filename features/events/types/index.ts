import { Event, EventType } from '@prisma/client';

export type { Event, EventType };

export type EventWithAuthor = Event & {
  author: {
    id: string;
    name: string;
    email: string;
  };
};

export type CreateEventData = {
  type: EventType;
  title: string;
  description: string;
  eventDate?: Date | null;
  location?: string | null;
};

export type UpdateEventData = Partial<CreateEventData>;

export type EventFilters = {
  type?: EventType;
  isPinned?: boolean;
  authorId?: string;
};
