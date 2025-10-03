import { z } from "zod";

export const removeMemberSchema = z.object({
  userId: z.string().cuid(),
});

export const updateMemberRoleSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(["ADMIN", "MEMBER"]),
});
