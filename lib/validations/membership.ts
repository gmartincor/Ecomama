import { z } from "zod";
import { cuidSchema, memberStatusEnum, textFieldSchema } from "./shared";

export const membershipRequestSchema = z.object({
  communityId: cuidSchema,
  message: textFieldSchema.long,
});

export const respondToRequestSchema = z.object({
  status: memberStatusEnum.extract(["APPROVED", "REJECTED"]),
  responseMessage: textFieldSchema.long.optional(),
});

export type MembershipRequestInput = z.infer<typeof membershipRequestSchema>;
export type RespondToRequestInput = z.infer<typeof respondToRequestSchema>;
