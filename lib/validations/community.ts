import { z } from 'zod';

export const createCommunitySchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(5, 'La dirección es requerida'),
  city: z.string().min(2, 'La ciudad es requerida'),
  country: z.string().min(2, 'El país es requerido'),
  adminId: z.string().cuid('ID de administrador inválido'),
});

export const updateCommunitySchema = createCommunitySchema.partial().omit({ adminId: true });

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>;
