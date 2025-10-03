import { prisma } from '@/lib/prisma/client';
import { BaseRepository } from '@/lib/repositories/base-repository';
import { Listing, ListingType, ListingStatus } from '@prisma/client';
import { buildWhereClause, buildSearchClause, withAuthor } from '@/lib/utils/prisma-helpers';

export type ListingWithAuthor = Listing & {
  author: {
    id: string;
    name: string;
    email: string;
  };
};

export type ListingFilters = {
  communityId: string;
  type?: ListingType;
  status?: ListingStatus;
  authorId?: string;
  search?: string;
};

class ListingRepository extends BaseRepository<ListingWithAuthor> {
  protected model = prisma.listing;

  async findByCommunity(filters: ListingFilters): Promise<ListingWithAuthor[]> {
    const { communityId, search, ...restFilters } = filters;

    const where: any = {
      communityId,
      ...buildWhereClause(restFilters),
    };

    if (search) {
      where.OR = buildSearchClause(['title', 'description'], search);
    }

    return this.findMany(where, { orderBy: { createdAt: 'desc' }, includeAuthor: true });
  }

  async createListing(
    communityId: string,
    authorId: string,
    data: { type: ListingType; title: string; description: string }
  ): Promise<ListingWithAuthor> {
    return this.create(
      {
        communityId,
        authorId,
        type: data.type,
        title: data.title,
        description: data.description,
        status: 'ACTIVE',
      },
      { includeAuthor: true }
    );
  }

  async updateListing(
    id: string,
    data: Partial<{ type: ListingType; title: string; description: string; status: ListingStatus }>
  ): Promise<ListingWithAuthor> {
    const updateData = buildWhereClause(data);
    return this.update(id, updateData, { includeAuthor: true });
  }

  async isAuthor(userId: string, listingId: string): Promise<boolean> {
    return this.exists({ id: listingId, authorId: userId });
  }
}

export const listingRepository = new ListingRepository();
