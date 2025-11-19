import { updateUserSchema } from "@/lib/validations/superadminValidation";
import { updateUser } from "@/features/superadmin/services/superadminService";
import { createPutHandler, requireSuperAdmin } from "@/lib/api";
import { ValidationError } from "@/lib/utils/api-response";
import { extractId } from "@/lib/utils/route-helpers";

export const PUT = createPutHandler(
  async ({ session, params, body }) => {
    const userId = extractId(params!.id);
    
    if (userId === session!.user.id) {
      throw new ValidationError("No puedes modificar tu propia cuenta");
    }

    return await updateUser(userId, body as Parameters<typeof updateUser>[1]);
  },
  updateUserSchema,
  requireSuperAdmin
);
