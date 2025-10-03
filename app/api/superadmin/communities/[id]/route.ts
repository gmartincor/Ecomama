import { updateCommunityStatusSchema } from "@/lib/validations/superadminValidation";
import { updateCommunityStatus } from "@/features/superadmin/services/superadminService";
import { createPutHandler, requireSuperAdmin } from "@/lib/api";

export const PUT = createPutHandler(
  async ({ params, body }) => {
    const communityId = params!.id;
    return await updateCommunityStatus(communityId, body);
  },
  updateCommunityStatusSchema,
  requireSuperAdmin
);
