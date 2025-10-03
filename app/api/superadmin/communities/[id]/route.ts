import { updateCommunityStatusSchema } from "@/lib/validations/superadminValidation";
import { updateCommunityStatus, deleteCommunity } from "@/features/superadmin/services/superadminService";
import { createPutHandler, createDeleteHandler, requireSuperAdmin } from "@/lib/api";

export const PUT = createPutHandler(
  async ({ params, body }) => {
    const communityId = params!.id;
    return await updateCommunityStatus(communityId, body);
  },
  updateCommunityStatusSchema,
  requireSuperAdmin
);

export const DELETE = createDeleteHandler(
  async ({ params }) => {
    const communityId = params!.id;
    await deleteCommunity(communityId);
    return { success: true };
  },
  requireSuperAdmin
);
