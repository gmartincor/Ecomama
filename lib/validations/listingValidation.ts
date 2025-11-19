import { z } from "zod";
import { listingTypeEnum, listingStatusEnum, textFieldSchema, coordinateSchema } from "./shared";

export { listingTypeEnum, listingStatusEnum };

export const createListingSchema = z.object({
  type: listingTypeEnum,
  title: textFieldSchema.medium,
  description: textFieldSchema.extraLong,
  latitude: coordinateSchema.latitude.optional(),
  longitude: coordinateSchema.longitude.optional(),
  city: textFieldSchema.short.optional(),
  country: textFieldSchema.short.optional(),
});

export const updateListingSchema = createListingSchema.partial().extend({
  status: listingStatusEnum.optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
