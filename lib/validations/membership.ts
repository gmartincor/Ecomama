import { z } from "zod";

export const membershipRequestSchema = z.object({
  communityId: z.string().cuid(),
  message: z.string().min(10).max(500),
});

export const respondToRequestSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  responseMessage: z.string().max(500).optional(),
});

export type MembershipRequestInput = z.infer<typeof membershipRequestSchema>;
export type RespondToRequestInput = z.infer<typeof respondToRequestSchema>;
