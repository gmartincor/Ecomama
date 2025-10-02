import { z } from 'zod';

export const listingSchema = z.object({
  type: z.enum(['OFFER', 'DEMAND']),
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(100),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(1000),
  communityId: z.string().cuid('ID de comunidad inválido'),
});

export type ListingInput = z.infer<typeof listingSchema>;
