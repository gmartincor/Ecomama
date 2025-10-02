import { z } from "zod";

export const updateUserSchema = z.object({
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
});

export const updateCommunityStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
  reason: z.string().max(500).optional(),
});

export const deleteUserSchema = z.object({
  userId: z.string().cuid(),
});

export const deleteCommunitySchema = z.object({
  communityId: z.string().cuid(),
});
