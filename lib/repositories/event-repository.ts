import { prisma } from '@/lib/prisma/client';
import { BaseRepository } from '@/lib/repositories/base-repository';
import { Event, EventType } from '@prisma/client';

export type EventWithAuthor = Event & {
  author: {
    id: string;
    name: string;
    email: string;
  };
};

export type EventFilters = {
  type?: EventType;
  isPinned?: boolean;
  authorId?: string;
  upcoming?: boolean;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
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

class EventRepository extends BaseRepository<EventWithAuthor> {
  protected model = prisma.event;

  async findAll(filters: EventFilters = {}): Promise<EventWithAuthor[]> {
    const { upcoming, ...restFilters } = filters;

    const where: Record<string, unknown> = {
      ...this.buildSafeUpdateData(restFilters),
    };

    if (upcoming) {
      where.eventDate = {
        gte: new Date(),
      };
    }

    return this.findMany(where, {
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      includeAuthor: true,
    });
  }

  async createEvent(
    authorId: string,
    data: CreateEventData
  ): Promise<EventWithAuthor> {
    return this.create(
      {
        authorId,
        ...data,
        eventDate: data.eventDate || null,
        location: data.location || null,
        isPinned: false,
      },
      { includeAuthor: true }
    );
  }

  async updateEvent(id: string, data: UpdateEventData): Promise<EventWithAuthor> {
    const updateData = this.buildSafeUpdateData({
      ...data,
      eventDate: data.eventDate !== undefined ? (data.eventDate ? new Date(data.eventDate) : null) : undefined,
    });
    
    return this.update(id, updateData, { includeAuthor: true });
  }

  async togglePin(id: string, isPinned: boolean): Promise<EventWithAuthor> {
    return this.update(id, { isPinned }, { includeAuthor: true });
  }

  async isAuthor(userId: string, eventId: string): Promise<boolean> {
    return this.exists({ id: eventId, authorId: userId });
  }
}

export const eventRepository = new EventRepository();
