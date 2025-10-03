import { z } from "zod";
import { listingTypeEnum, listingStatusEnum, textFieldSchema } from "./shared";

export { listingTypeEnum, listingStatusEnum };

export const createListingSchema = z.object({
  type: listingTypeEnum,
  title: textFieldSchema.medium,
  description: textFieldSchema.extraLong,
});

export const updateListingSchema = createListingSchema.partial().extend({
  status: listingStatusEnum.optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
