import { prisma } from '@/lib/prisma/client';
import { BaseRepository } from '@/lib/repositories/base-repository';
import { Event, EventType } from '@prisma/client';
import { buildWhereClause, withAuthor } from '@/lib/utils/prisma-helpers';

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

class EventRepository extends BaseRepository<EventWithAuthor> {
  protected model = prisma.event;

  async findByCommunity(filters: EventFilters): Promise<EventWithAuthor[]> {
    const { communityId, ...restFilters } = filters;

    const where = {
      communityId,
      ...buildWhereClause(restFilters),
    };

    return this.findMany(where, {
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      includeAuthor: true,
    });
  }

  async createEvent(
    communityId: string,
    authorId: string,
    data: {
      type: EventType;
      title: string;
      description: string;
      eventDate?: Date | null;
      location?: string | null;
    }
  ): Promise<EventWithAuthor> {
    return this.create(
      {
        communityId,
        authorId,
        type: data.type,
        title: data.title,
        description: data.description,
        eventDate: data.eventDate || null,
        location: data.location || null,
        isPinned: false,
      },
      { includeAuthor: true }
    );
  }

  async updateEvent(
    id: string,
    data: Partial<{
      type: EventType;
      title: string;
      description: string;
      eventDate: Date | string | null;
      location: string | null;
    }>
  ): Promise<EventWithAuthor> {
    const updateData: any = {};
    
    if (data.type !== undefined) updateData.type = data.type;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.eventDate !== undefined) {
      updateData.eventDate = data.eventDate ? new Date(data.eventDate) : null;
    }
    
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
