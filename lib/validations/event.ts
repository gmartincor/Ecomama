import { z } from 'zod';

export const eventSchema = z.object({
  type: z.enum(['ANNOUNCEMENT', 'EVENT', 'NEWS']),
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(100),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(2000),
  eventDate: z.string().datetime().optional(),
  location: z.string().max(200).optional(),
  isPinned: z.boolean().default(false),
});

export type EventInput = z.infer<typeof eventSchema>;
