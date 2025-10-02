import { z } from "zod";

export const updateCommunitySchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").max(1000),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),
  country: z.string().min(2, "El país debe tener al menos 2 caracteres"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const removeMemberSchema = z.object({
  userId: z.string().cuid(),
});

export const updateMemberRoleSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(["ADMIN", "MEMBER"]),
});
