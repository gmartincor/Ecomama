import { createGetHandler, requireSuperAdmin } from "@/lib/api";
import { getSelectableUsers } from "@/features/superadmin/services/superadminService";

export const GET = createGetHandler(
  async () => {
    return await getSelectableUsers();
  },
  true,
  requireSuperAdmin
);
