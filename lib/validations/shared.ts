import { z } from "zod";

export const cuidSchema = z.string().cuid();

export const userRoleEnum = z.enum(["USER", "SUPERADMIN"]);
export const userStatusEnum = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);
export const listingTypeEnum = z.enum(["OFFER", "DEMAND"]);
export const listingStatusEnum = z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]);
export const eventTypeEnum = z.enum(["ANNOUNCEMENT", "EVENT"]);

export const timestampSchema = z.string().datetime();

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const textFieldSchema = {
  short: z.string().min(3).max(100),
  medium: z.string().min(0).max(200),
  long: z.string().min(10).max(500),
  extraLong: z.string().min(10).max(5000),
};

export const coordinateSchema = {
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
};

export type UserRole = z.infer<typeof userRoleEnum>;
export type UserStatus = z.infer<typeof userStatusEnum>;
export type ListingType = z.infer<typeof listingTypeEnum>;
export type ListingStatus = z.infer<typeof listingStatusEnum>;
export type EventType = z.infer<typeof eventTypeEnum>;
export type Pagination = z.infer<typeof paginationSchema>;
