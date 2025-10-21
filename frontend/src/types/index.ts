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
  role: string;
  emailVerified: boolean;
  profile: Profile;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  bio?: string;
  avatarUrl?: string;
  city?: string;
  country?: string;
  preferredLocale?: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  preferredLocale?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  city?: string;
  country?: string;
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
