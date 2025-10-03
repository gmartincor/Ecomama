import { adminService } from "@/features/admin/services/adminService";
import { updateCommunitySchema } from "@/lib/validations/community";
import { createPutHandler } from "@/lib/api";

export const PUT = createPutHandler(
  async ({ params, body }) => {
    const communityId = params!.id;
    return await adminService.updateCommunity(communityId, body);
  },
  updateCommunitySchema,
  async ({ session, params }) => {
    if (!session) return false;
    const communityId = params!.id;
    return await adminService.isUserCommunityAdmin(session.user.id, communityId);
  }
);
