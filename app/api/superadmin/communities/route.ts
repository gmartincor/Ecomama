import { superadminService } from "@/features/superadmin/services/superadminService";
import { createGetHandler, requireSuperAdmin } from "@/lib/api";

export const GET = createGetHandler(
  async () => {
    return await superadminService.getAllCommunities();
  },
  true,
  requireSuperAdmin
);
