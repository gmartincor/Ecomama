import { removeMember } from "@/features/admin/services/adminService";
import { createDeleteHandler, communityAdminFromId } from "@/lib/api";
import { ValidationError } from "@/lib/utils/api-response";

export const DELETE = createDeleteHandler(
  async ({ session, params }) => {
    const { id: communityId, userId } = params!;
    
    if (session!.user.id === userId) {
      throw new ValidationError("No puedes eliminarte a ti mismo");
    }

    await removeMember(communityId, userId);
    return { success: true };
  },
  communityAdminFromId
);
