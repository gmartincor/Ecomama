import { getListings, createListing } from "@/features/listings/services/listingService";
import { hasUserAccessToCommunity } from "@/features/memberships/services/membershipService";
import { createListingSchema } from "@/lib/validations/listingValidation";
import { createGetHandler, createPostHandler, parseFilters, extractRequiredParam } from "@/lib/api";
import type { ListingFilters } from "@/features/listings/types";
import { ForbiddenError, ValidationError } from "@/lib/utils/api-response";
import { z } from "zod";

const createListingWithCommunitySchema = createListingSchema.extend({
  communityId: z.string(),
});

export const GET = createGetHandler(async ({ session, searchParams }) => {
  const communityId = extractRequiredParam(searchParams!, 'communityId', 'El ID de comunidad es requerido');

  const hasAccess = await hasUserAccessToCommunity(session!.user.id, communityId);
  if (!hasAccess) {
    throw new ForbiddenError('Debes ser miembro para ver anuncios');
  }

  const filters = parseFilters<Omit<ListingFilters, 'communityId'>>(searchParams!, {
    type: { type: 'enum', enumValues: ['OFFER', 'DEMAND'] as const },
    status: { type: 'enum', enumValues: ['ACTIVE', 'INACTIVE', 'EXPIRED'] as const },
    authorId: { type: 'string' },
    search: { type: 'string' },
  });

  return await getListings(communityId, filters);
});

export const POST = createPostHandler(
  async ({ session, body }) => {
    const { communityId, ...listingData } = body;

    const hasAccess = await hasUserAccessToCommunity(session!.user.id, communityId);
    if (!hasAccess) {
      throw new ForbiddenError('Debes ser miembro para crear anuncios');
    }

    return await createListing(communityId, session!.user.id, listingData);
  },
  createListingWithCommunitySchema
);
