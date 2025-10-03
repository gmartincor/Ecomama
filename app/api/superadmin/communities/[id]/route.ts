import { superadminService } from "@/features/superadmin/services/superadminService";
import { updateCommunityStatusSchema } from "@/lib/validations/superadminValidation";
import { createPutHandler, createDeleteHandler, requireSuperAdmin } from "@/lib/api";

export const PUT = createPutHandler(
  async ({ params, body }) => {
    const communityId = params!.id;
    return await superadminService.updateCommunityStatus(communityId, body);
  },
  updateCommunityStatusSchema,
  requireSuperAdmin
);

export const DELETE = createDeleteHandler(
  async ({ params }) => {
    const communityId = params!.id;
    await superadminService.deleteCommunity(communityId);
    return { success: true };
  },
  requireSuperAdmin
);
