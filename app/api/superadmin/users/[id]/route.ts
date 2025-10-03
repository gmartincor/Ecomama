import { updateUserSchema } from "@/lib/validations/superadminValidation";
import { updateUser } from "@/features/superadmin/services/superadminService";
import { createPutHandler, requireSuperAdmin } from "@/lib/api";
import { ValidationError } from "@/lib/utils/api-response";

export const PUT = createPutHandler(
  async ({ session, params, body }) => {
    const userId = params!.id;
    
    if (userId === session!.user.id) {
      throw new ValidationError("No puedes modificar tu propia cuenta");
    }

    return await updateUser(userId, body);
  },
  updateUserSchema,
  requireSuperAdmin
);
