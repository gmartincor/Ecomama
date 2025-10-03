import { getListingById, updateListing, deleteListing } from "@/features/listings/services/listingService";
import { updateListingSchema } from "@/lib/validations/listingValidation";
import { createGetHandler, createPutHandler, createDeleteHandler, listingOwnerCheck } from "@/lib/api";
import { NotFoundError } from "@/lib/utils/api-response";

export const GET = createGetHandler(async ({ params }) => {
  const listingId = params!.id;
  const listing = await getListingById(listingId);

  if (!listing) {
    throw new NotFoundError("Anuncio no encontrado");
  }

  return listing;
});

export const PUT = createPutHandler(
  async ({ params, body }) => {
    const listingId = params!.id;
    return await updateListing(listingId, body);
  },
  updateListingSchema,
  listingOwnerCheck
);

export const DELETE = createDeleteHandler(
  async ({ params }) => {
    const listingId = params!.id;
    await deleteListing(listingId);
    return { success: true };
  },
  listingOwnerCheck
);
