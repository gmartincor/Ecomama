import { adminService } from "@/features/admin/services/adminService";
import { createDeleteHandler } from "@/lib/api";
import { ValidationError } from "@/lib/utils/api-response";

export const DELETE = createDeleteHandler(
  async ({ session, params }) => {
    const { id: communityId, userId } = params!;
    
    if (session!.user.id === userId) {
      throw new ValidationError("No puedes eliminarte a ti mismo");
    }

    await adminService.removeMember(communityId, userId);
    return { success: true };
  },
  async ({ session, params }) => {
    if (!session) return false;
    const communityId = params!.id;
    return await adminService.isUserCommunityAdmin(session.user.id, communityId);
  }
);
