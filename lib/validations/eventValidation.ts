import { z } from "zod";

export const eventTypeEnum = z.enum(["ANNOUNCEMENT", "EVENT", "NEWS"]);

export const createEventSchema = z.object({
  type: eventTypeEnum,
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(200, "El título es muy largo"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").max(5000, "La descripción es muy larga"),
  eventDate: z.string().datetime().optional().nullable(),
  location: z.string().max(200, "La ubicación es muy larga").optional().nullable(),
});

export const updateEventSchema = createEventSchema.partial();

export const pinEventSchema = z.object({
  isPinned: z.boolean(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type PinEventInput = z.infer<typeof pinEventSchema>;
