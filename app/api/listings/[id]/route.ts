import { getListingById, updateListing, deleteListing } from "@/features/listings/services/listingService";
import { updateListingSchema } from "@/lib/validations/listingValidation";
import { createGetHandler, createPutHandler, createDeleteHandler, listingOwnerCheck } from "@/lib/api";
import { NotFoundError } from "@/lib/utils/api-response";
import { extractId } from "@/lib/utils/route-helpers";

export const GET = createGetHandler(async ({ params }) => {
  const listingId = extractId(params!.id);
  const listing = await getListingById(listingId);

  if (!listing) {
    throw new NotFoundError("Anuncio no encontrado");
  }

  return listing;
});

export const PUT = createPutHandler(
  async ({ params, body }) => {
    const listingId = extractId(params!.id);
    return await updateListing(listingId, body as Parameters<typeof updateListing>[1]);
  },
  updateListingSchema,
  listingOwnerCheck
);

export const DELETE = createDeleteHandler(
  async ({ params }) => {
    const listingId = extractId(params!.id);
    await deleteListing(listingId);
    return { success: true };
  },
  listingOwnerCheck
);
