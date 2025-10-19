/**
 * API Response Type
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  timestamp: string;
}

/**
 * API Error Type
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * User Type
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User Role Enum
 */
export enum UserRole {
  FARMER = 'FARMER',
  CONSUMER = 'CONSUMER',
  ADMIN = 'ADMIN',
}

/**
 * Listing Type (Marketplace)
 */
export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: ListingType;
  category: string;
  images: string[];
  location: GeoLocation;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Listing Type Enum
 */
export enum ListingType {
  OFFER = 'OFFER',
  DEMAND = 'DEMAND',
}

/**
 * Listing Status Enum
 */
export enum ListingStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SOLD = 'SOLD',
}

/**
 * GeoLocation Type
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

/**
 * Event Type
 */
export interface Event {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  location: GeoLocation;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  createdAt: string;
}

/**
 * Pagination Type
 */
export interface Pagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

/**
 * Paginated Response Type
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}
