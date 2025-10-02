import { z } from 'zod';

export const profileSchema = z.object({
  bio: z.string().max(500, 'La biografía no puede exceder 500 caracteres').optional(),
  phone: z.string().regex(/^[+]?[\d\s-()]+$/, 'Número de teléfono inválido').optional(),
  location: z.string().max(100).optional(),
  avatar: z.string().optional(),
  isPublic: z.boolean().default(true),
});

export type ProfileInput = z.infer<typeof profileSchema>;
