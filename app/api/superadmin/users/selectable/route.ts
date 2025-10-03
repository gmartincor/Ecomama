import { createGetHandler, requireSuperAdmin } from "@/lib/api";
import { getSelectableUsers } from "@/features/superadmin/services/userSelectionService";

export const GET = createGetHandler(
  async () => {
    return await getSelectableUsers();
  },
  true,
  requireSuperAdmin
);
