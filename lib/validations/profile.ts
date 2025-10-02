import { z } from "zod";

const MAX_BIO_LENGTH = 500;
const MAX_PHONE_LENGTH = 20;
const MAX_LOCATION_LENGTH = 100;

export const profileSchema = z.object({
  bio: z.string().max(MAX_BIO_LENGTH).optional(),
  phone: z.string().max(MAX_PHONE_LENGTH).optional(),
  location: z.string().max(MAX_LOCATION_LENGTH).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
  isPublic: z.boolean().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
