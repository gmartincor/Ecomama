import { adminService } from "@/features/admin/services/adminService";
import { createGetHandler } from "@/lib/api";
import { UserRole } from "@prisma/client";

export const GET = createGetHandler(
  async ({ params }) => {
    const communityId = params!.id;
    return await adminService.getCommunityStats(communityId);
  },
  true,
  async ({ session, params }) => {
    if (!session) return false;
    const communityId = params!.id;
    return await adminService.isUserCommunityAdmin(session.user.id, communityId);
  }
);
