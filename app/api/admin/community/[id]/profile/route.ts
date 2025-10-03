import { updateCommunity } from "@/features/admin/services/adminService";
import { updateCommunitySchema } from "@/lib/validations/community";
import { createPutHandler, communityAdminFromId } from "@/lib/api";

export const PUT = createPutHandler(
  async ({ params, body }) => {
    const communityId = params!.id;
    await updateCommunity(communityId, body);
    return { success: true };
  },
  updateCommunitySchema,
  communityAdminFromId
);
