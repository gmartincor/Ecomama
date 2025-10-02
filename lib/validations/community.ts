import { z } from "zod";

const COORDINATE_MIN = -90;
const COORDINATE_MAX = 90;
const LONGITUDE_MIN = -180;
const LONGITUDE_MAX = 180;

export const createCommunitySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  latitude: z.number().min(COORDINATE_MIN).max(COORDINATE_MAX),
  longitude: z.number().min(LONGITUDE_MIN).max(LONGITUDE_MAX),
  address: z.string().min(3).max(200),
  city: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
});

export const updateCommunitySchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  latitude: z.number().min(COORDINATE_MIN).max(COORDINATE_MAX).optional(),
  longitude: z.number().min(LONGITUDE_MIN).max(LONGITUDE_MAX).optional(),
  address: z.string().min(3).max(200).optional(),
  city: z.string().min(2).max(100).optional(),
  country: z.string().min(2).max(100).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const communityFiltersSchema = z.object({
  latitude: z.number().min(COORDINATE_MIN).max(COORDINATE_MAX).optional(),
  longitude: z.number().min(LONGITUDE_MIN).max(LONGITUDE_MAX).optional(),
  radiusKm: z.number().min(1).max(1000).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  search: z.string().optional(),
});

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>;
export type CommunityFiltersInput = z.infer<typeof communityFiltersSchema>;
