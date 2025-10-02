export type ListingType = "OFFER" | "DEMAND";

export type ListingStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";

export type Listing = {
  id: string;
  type: ListingType;
  title: string;
  description: string;
  authorId: string;
  communityId: string;
  status: ListingStatus;
  createdAt: Date;
  updatedAt: Date;
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
