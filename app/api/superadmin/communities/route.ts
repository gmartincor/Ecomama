import { createGetHandler, requireSuperAdmin } from "@/lib/api";
import { getAllCommunities } from "@/features/superadmin/services/superadminService";

export const GET = createGetHandler(
  async () => {
    return await getAllCommunities();
  },
  true,
  requireSuperAdmin
);
