import { updateCommunitySchema } from "@/lib/validations/community";
import { getCommunityById, updateCommunity, deleteCommunity } from "@/features/communities/services/communityService";
import { createGetHandler, createPutHandler, createDeleteHandler, requireSuperAdmin, communityOwnerCheck } from "@/lib/api";
import { NotFoundError } from "@/lib/utils/api-response";

export const GET = createGetHandler(async ({ params }) => {
  const communityId = params!.id;
  const community = await getCommunityById(communityId);

  if (!community) {
    throw new NotFoundError("Comunidad no encontrada");
  }

  return community;
}, false);

export const PUT = createPutHandler(
  async ({ params, body }) => {
    const communityId = params!.id;
    return await updateCommunity(communityId, body);
  },
  updateCommunitySchema,
  communityOwnerCheck
);

export const DELETE = createDeleteHandler(
  async ({ params }) => {
    const communityId = params!.id;
    await deleteCommunity(communityId);
    return { success: true };
  },
  requireSuperAdmin
);
