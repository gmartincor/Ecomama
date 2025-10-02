import { z } from 'zod';

export const membershipRequestSchema = z.object({
  communityId: z.string().cuid('ID de comunidad inválido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(500, 'El mensaje no puede exceder 500 caracteres'),
});

export const respondToRequestSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  responseMessage: z.string().optional(),
});

export type MembershipRequestInput = z.infer<typeof membershipRequestSchema>;
export type RespondToRequestInput = z.infer<typeof respondToRequestSchema>;
