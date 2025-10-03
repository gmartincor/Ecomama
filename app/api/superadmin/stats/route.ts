import { createGetHandler, requireSuperAdmin } from "@/lib/api";
import { getGlobalStats } from "@/features/superadmin/services/superadminService";

export const GET = createGetHandler(
  async () => {
    return await getGlobalStats();
  },
  true,
  requireSuperAdmin
);
