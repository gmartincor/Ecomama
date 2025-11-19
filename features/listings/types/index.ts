import { Listing, ListingType, ListingStatus } from '@prisma/client';

export type { Listing, ListingType, ListingStatus };

export type ListingWithAuthor = Listing & {
  author: {
    id: string;
    name: string;
    email: string;
    profile: {
      phone: string | null;
    } | null;
  };
};

export type UserListingWithDetails = {
  id: string;
  type: ListingType;
  title: string;
  description: string;
  status: ListingStatus;
  city: string | null;
  country: string | null;
  createdAt: Date;
  updatedAt: Date;
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
