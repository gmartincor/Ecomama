import { z } from "zod";
import { textFieldSchema, coordinateSchema, communityStatusEnum } from "./shared";

export const createCommunitySchema = z.object({
  name: textFieldSchema.short,
  description: textFieldSchema.long,
  latitude: coordinateSchema.latitude,
  longitude: coordinateSchema.longitude,
  address: textFieldSchema.medium,
  city: textFieldSchema.short,
  country: textFieldSchema.short,
  adminId: z.string().cuid(),
});

export const updateCommunitySchema = z.object({
  name: textFieldSchema.short.optional(),
  description: textFieldSchema.long.optional(),
  latitude: coordinateSchema.latitude.optional(),
  longitude: coordinateSchema.longitude.optional(),
  address: textFieldSchema.medium.optional(),
  city: textFieldSchema.short.optional(),
  country: textFieldSchema.short.optional(),
  status: communityStatusEnum.optional(),
});

export const communityFiltersSchema = z.object({
  latitude: coordinateSchema.latitude.optional(),
  longitude: coordinateSchema.longitude.optional(),
  radiusKm: z.number().min(1).max(1000).optional(),
  status: communityStatusEnum.optional(),
  search: z.string().optional(),
});

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>;
export type CommunityFiltersInput = z.infer<typeof communityFiltersSchema>;
