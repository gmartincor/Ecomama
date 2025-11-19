import { Listing, ListingType, ListingStatus } from '@prisma/client';

export type { Listing, ListingType, ListingStatus };

export type ListingWithAuthor = Listing & {
  author: {
    id: string;
    name: string;
    email: string;
  };
};

export type CreateListingData = {
  type: ListingType;
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
};

export type UpdateListingData = Partial<CreateListingData> & {
  status?: ListingStatus;
};

export type ListingFilters = {
  type?: ListingType;
  status?: ListingStatus;
  authorId?: string;
  search?: string;
};
