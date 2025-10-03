import { createGetHandler, requireSuperAdmin } from "@/lib/api";
import { getAllUsers } from "@/features/superadmin/services/superadminService";

export const GET = createGetHandler(
  async () => {
    return await getAllUsers();
  },
  true,
  requireSuperAdmin
);
