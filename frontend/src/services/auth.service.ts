import { api } from './api-client';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  User,
  Profile,
  ApiResponse,
} from '@/types';

export const authService = {
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>('/auth/login', data);
  },

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>('/auth/register', data);
  },

  async logout(): Promise<ApiResponse<string>> {
    return api.post<string>('/auth/logout');
  },

  async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
    return api.post<AuthResponse>('/auth/refresh-token', data);
  },

  async verifyEmail(email: string, data: VerifyEmailRequest): Promise<ApiResponse<string>> {
    return api.post<string>(`/auth/verify-email?email=${encodeURIComponent(email)}`, data);
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<string>> {
    return api.post<string>('/password/forgot', data);
  },

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<string>> {
    return api.post<string>('/password/reset', data);
  },

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<string>> {
    return api.post<string>('/password/change', data);
  },

  async getProfile(): Promise<ApiResponse<User>> {
    return api.get<User>('/users/profile');
  },

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<Profile>> {
    return api.put<Profile>('/users/profile', data);
  },
};
