import { z } from "zod";
import { textFieldSchema } from "./shared";

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const profileSchema = z.object({
  bio: textFieldSchema.long.optional().nullable(),
  phone: z.string().regex(phoneRegex, "Formato de teléfono inválido").optional().nullable(),
  location: textFieldSchema.short.optional().nullable(),
  avatar: z.string().url("URL de avatar inválida").optional().nullable(),
  isPublic: z.boolean().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
