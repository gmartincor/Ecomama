import { updateUserSchema } from "@/lib/validations/superadminValidation";
import { updateUser, deleteUser } from "@/features/superadmin/services/superadminService";
import { createPutHandler, createDeleteHandler, requireSuperAdmin } from "@/lib/api";
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

export const DELETE = createDeleteHandler(
  async ({ session, params }) => {
    const userId = params!.id;
    
    if (userId === session!.user.id) {
      throw new ValidationError("No puedes eliminar tu propia cuenta");
    }

    await deleteUser(userId);
    return { success: true };
  },
  requireSuperAdmin
);
