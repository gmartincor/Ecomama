import { getAdminMembers } from "@/features/admin/services/adminService";
import { createGetHandler, communityAdminFromId } from "@/lib/api";

export const GET = createGetHandler(
  async ({ params }) => {
    const communityId = params!.id;
    return await getAdminMembers(communityId);
  },
  true,
  communityAdminFromId
);
