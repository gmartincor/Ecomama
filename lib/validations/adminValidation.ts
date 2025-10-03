import { z } from "zod";
import { cuidSchema, memberRoleEnum } from "./shared";

export const removeMemberSchema = z.object({
  userId: cuidSchema,
});

export const updateMemberRoleSchema = z.object({
  userId: cuidSchema,
  role: memberRoleEnum,
});
