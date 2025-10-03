import { prisma } from '@/lib/prisma/client';
import { BaseRepository } from '@/lib/repositories/base-repository';
import { Listing, ListingType, ListingStatus } from '@prisma/client';
import { buildSearchClause } from '@/lib/utils/prisma-helpers';

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

export type CreateListingData = {
  type: ListingType;
  title: string;
  description: string;
};

export type UpdateListingData = Partial<CreateListingData & { status: ListingStatus }>;

class ListingRepository extends BaseRepository<ListingWithAuthor> {
  protected model = prisma.listing;

  async findByCommunity(filters: ListingFilters): Promise<ListingWithAuthor[]> {
    const { communityId, search, ...restFilters } = filters;

    const where: any = {
      communityId,
      ...this.buildSafeUpdateData(restFilters),
    };

    if (search) {
      where.OR = buildSearchClause(['title', 'description'], search);
    }

    return this.findMany(where, { 
      orderBy: { createdAt: 'desc' }, 
      includeAuthor: true 
    });
  }

  async createListing(
    communityId: string,
    authorId: string,
    data: CreateListingData
  ): Promise<ListingWithAuthor> {
    return this.create(
      {
        communityId,
        authorId,
        ...data,
        status: 'ACTIVE',
      },
      { includeAuthor: true }
    );
  }

  async updateListing(id: string, data: UpdateListingData): Promise<ListingWithAuthor> {
    const updateData = this.buildSafeUpdateData(data);
    return this.update(id, updateData, { includeAuthor: true });
  }

  async isAuthor(userId: string, listingId: string): Promise<boolean> {
    return this.exists({ id: listingId, authorId: userId });
  }
}

export const listingRepository = new ListingRepository();
