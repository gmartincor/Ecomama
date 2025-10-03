import { superadminService } from "@/features/superadmin/services/superadminService";
import { updateUserSchema } from "@/lib/validations/superadminValidation";
import { createPutHandler, createDeleteHandler, requireSuperAdmin } from "@/lib/api";
import { ValidationError } from "@/lib/utils/api-response";

export const PUT = createPutHandler(
  async ({ session, params, body }) => {
    const userId = params!.id;
    
    if (userId === session!.user.id) {
      throw new ValidationError("No puedes modificar tu propia cuenta");
    }

    return await superadminService.updateUser(userId, body);
  },
  updateUserSchema,
  requireSuperAdmin
);

export const DELETE = createDeleteHandler(
  async ({ session, params }) => {
    const userId = params!.id;
    
    if (userId === session!.user.id) {
      throw new ValidationError("No puedes eliminar tu propia cuenta");
    }

    await superadminService.deleteUser(userId);
    return { success: true };
  },
  requireSuperAdmin
);
