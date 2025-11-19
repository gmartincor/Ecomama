import { z } from "zod";
import { UserRole, UserStatus } from "@prisma/client";

export const updateUserSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
