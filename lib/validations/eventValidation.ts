import { z } from "zod";
import { eventTypeEnum, textFieldSchema, timestampSchema, coordinateSchema } from "./shared";

export { eventTypeEnum };

export const createEventSchema = z.object({
  type: eventTypeEnum,
  title: textFieldSchema.medium,
  description: textFieldSchema.extraLong,
  eventDate: timestampSchema.optional().nullable(),
  location: textFieldSchema.medium.optional().nullable(),
  latitude: coordinateSchema.latitude.optional(),
  longitude: coordinateSchema.longitude.optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const pinEventSchema = z.object({
  isPinned: z.boolean(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type PinEventInput = z.infer<typeof pinEventSchema>;
