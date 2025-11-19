import { getListings, createListing } from "@/features/listings/services/listingService";
import { createListingSchema } from "@/lib/validations/listingValidation";
import { createGetHandler, createPostHandler, parseFilters } from "@/lib/api";
import type { ListingFilters } from "@/lib/repositories/listing-repository";

export const GET = createGetHandler(async ({ searchParams }) => {
  const filters = parseFilters<ListingFilters>(searchParams!, {
    type: { type: 'enum', enumValues: ['OFFER', 'DEMAND'] as const },
    status: { type: 'enum', enumValues: ['ACTIVE', 'INACTIVE', 'EXPIRED'] as const },
    authorId: { type: 'string' },
    search: { type: 'string' },
  });

  return await getListings(filters);
});

export const POST = createPostHandler(
  async ({ session, body }) => {
    return await createListing(session!.user.id, body);
  },
  createListingSchema
);
