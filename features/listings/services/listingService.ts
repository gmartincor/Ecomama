import { listingRepository, ListingWithAuthor, ListingFilters } from '@/lib/repositories/listing-repository';
import type { CreateListingData, UpdateListingData } from '../types';

export const getListings = async (
  filters?: ListingFilters
): Promise<ListingWithAuthor[]> => {
  return listingRepository.findAll(filters);
};

export const getListingById = async (listingId: string): Promise<ListingWithAuthor | null> => {
  return listingRepository.findById(listingId, { includeAuthor: true });
};

export const createListing = async (
  authorId: string,
  data: CreateListingData
): Promise<ListingWithAuthor> => {
  return listingRepository.createListing(authorId, data);
};

export const updateListing = async (
  listingId: string,
  data: UpdateListingData
): Promise<ListingWithAuthor> => {
  return listingRepository.updateListing(listingId, data);
};

export const deleteListing = async (listingId: string): Promise<void> => {
  await listingRepository.delete(listingId);
};

export const isUserListingAuthor = async (
  userId: string,
  listingId: string
): Promise<boolean> => {
  return listingRepository.isAuthor(userId, listingId);
};
