import { getListingById, updateListing, deleteListing } from "@/features/listings/services/listingService";
import { updateListingSchema } from "@/lib/validations/listingValidation";
import { createGetHandler, createPutHandler, createDeleteHandler, listingOwnerCheck } from "@/lib/api";
import { NotFoundError } from "@/lib/utils/api-response";
import { extractId } from "@/lib/utils/route-helpers";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

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
    const result = await updateListing(listingId, body as Parameters<typeof updateListing>[1]);
    
    revalidatePath('/listings');
    revalidatePath('/profile/me');
    
    return result;
  },
  updateListingSchema,
  listingOwnerCheck
);

export const DELETE = createDeleteHandler(
  async ({ params }) => {
    const listingId = extractId(params!.id);
    await deleteListing(listingId);
    
    revalidatePath('/listings');
    revalidatePath('/profile/me');
    
    return { success: true };
  },
  listingOwnerCheck
);
