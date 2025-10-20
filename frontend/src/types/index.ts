export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

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

export enum UserRole {
  FARMER = 'FARMER',
  CONSUMER = 'CONSUMER',
  ADMIN = 'ADMIN',
}

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

export enum ListingType {
  OFFER = 'OFFER',
  DEMAND = 'DEMAND',
}

export enum ListingStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SOLD = 'SOLD',
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

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

export interface Pagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}
