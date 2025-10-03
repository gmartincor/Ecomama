import { z } from "zod";
import { cuidSchema, userRoleEnum, userStatusEnum, communityStatusEnum, textFieldSchema } from "./shared";

export const updateUserSchema = z.object({
  role: userRoleEnum.optional(),
  status: userStatusEnum.optional(),
});

export const updateCommunityStatusSchema = z.object({
  status: communityStatusEnum,
  reason: textFieldSchema.long.optional(),
});

export const deleteUserSchema = z.object({
  userId: cuidSchema,
});

export const deleteCommunitySchema = z.object({
  communityId: cuidSchema,
});
