import { z } from "zod";
import { textFieldSchema } from "./shared";

export const profileSchema = z.object({
  bio: textFieldSchema.long.optional().nullable(),
  phone: z.string().min(1).max(20).optional().nullable().or(z.literal('')),
  location: textFieldSchema.short.optional().nullable(),
  avatar: z.string().optional().nullable().or(z.literal('')),
});

export type ProfileInput = z.infer<typeof profileSchema>;
