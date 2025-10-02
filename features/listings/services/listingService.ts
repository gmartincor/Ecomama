import { prisma } from "@/lib/prisma/client";
import type { Listing, CreateListingData, UpdateListingData, ListingFilters } from "../types";

export const getListings = async (
  communityId: string,
  filters?: ListingFilters
): Promise<Listing[]> => {
  const whereClause: any = {
    communityId,
  };

  if (filters?.type) {
    whereClause.type = filters.type;
  }

  if (filters?.status) {
    whereClause.status = filters.status;
  }

  if (filters?.authorId) {
    whereClause.authorId = filters.authorId;
  }

  if (filters?.search) {
    whereClause.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const listings = await prisma.listing.findMany({
    where: whereClause,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return listings;
};

export const getListingById = async (listingId: string): Promise<Listing | null> => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return listing;
};

export const createListing = async (
  communityId: string,
  authorId: string,
  data: CreateListingData
): Promise<Listing> => {
  const listing = await prisma.listing.create({
    data: {
      communityId,
      authorId,
      type: data.type,
      title: data.title,
      description: data.description,
      status: "ACTIVE",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return listing;
};

export const updateListing = async (
  listingId: string,
  data: UpdateListingData
): Promise<Listing> => {
  const listing = await prisma.listing.update({
    where: { id: listingId },
    data: {
      ...(data.type && { type: data.type }),
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.status && { status: data.status }),
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return listing;
};

export const deleteListing = async (listingId: string): Promise<void> => {
  await prisma.listing.delete({
    where: { id: listingId },
  });
};

export const isUserListingAuthor = async (
  userId: string,
  listingId: string
): Promise<boolean> => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { authorId: true },
  });

  return listing?.authorId === userId;
};
