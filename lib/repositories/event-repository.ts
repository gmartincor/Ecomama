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
  communityId: string;
  type?: EventType;
  isPinned?: boolean;
  authorId?: string;
};

export type CreateEventData = {
  type: EventType;
  title: string;
  description: string;
  eventDate?: Date | null;
  location?: string | null;
};

export type UpdateEventData = Partial<CreateEventData>;

class EventRepository extends BaseRepository<EventWithAuthor> {
  protected model = prisma.event;

  async findByCommunity(filters: EventFilters): Promise<EventWithAuthor[]> {
    const { communityId, ...restFilters } = filters;

    const where = {
      communityId,
      ...this.buildSafeUpdateData(restFilters),
    };

    return this.findMany(where, {
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      includeAuthor: true,
    });
  }

  async createEvent(
    communityId: string,
    authorId: string,
    data: CreateEventData
  ): Promise<EventWithAuthor> {
    return this.create(
      {
        communityId,
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

  async isUserAdminOfCommunity(userId: string, eventId: string): Promise<boolean> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        community: {
          select: {
            adminId: true,
          },
        },
      },
    });

    return event?.community.adminId === userId;
  }
}

export const eventRepository = new EventRepository();
