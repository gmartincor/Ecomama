import { z } from "zod";

export const listingTypeEnum = z.enum(["OFFER", "DEMAND"]);
export const listingStatusEnum = z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]);

export const createListingSchema = z.object({
  type: listingTypeEnum,
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(200, "El título es muy largo"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").max(5000, "La descripción es muy larga"),
});

export const updateListingSchema = createListingSchema.partial().extend({
  status: listingStatusEnum.optional(),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
