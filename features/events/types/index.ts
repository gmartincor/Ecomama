export type EventType = "ANNOUNCEMENT" | "EVENT" | "NEWS";

export type Event = {
  id: string;
  communityId: string;
  authorId: string;
  type: EventType;
  title: string;
  description: string;
  eventDate: Date | null;
  location: string | null;
  isPinned: boolean;
  createdAt: Date;
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
