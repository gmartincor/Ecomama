import { adminService } from "@/features/admin/services/adminService";
import { createGetHandler } from "@/lib/api";

export const GET = createGetHandler(
  async ({ params }) => {
    const communityId = params!.id;
    return await adminService.getAdminMembers(communityId);
  },
  true,
  async ({ session, params }) => {
    if (!session) return false;
    const communityId = params!.id;
    return await adminService.isUserCommunityAdmin(session.user.id, communityId);
  }
);
