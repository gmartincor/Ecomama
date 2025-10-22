'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { authService } from '@/services/auth.service';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_STORAGE_KEY = 'access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  };

  const clearTokens = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  };

  const loadUser = async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        clearTokens();
      }
    } catch {
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(data);

      if (response.success && response.data) {
        saveTokens(response.data.accessToken, response.data.refreshToken);
        setUser(response.data.user);
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
        router.push(`/${locale}`);
      } else {
        const errorMessage = response.error?.message || 'Login failed';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Login failed',
          description: errorMessage,
        });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.register({ ...data, preferredLocale: locale });

      if (response.success && response.data) {
        saveTokens(response.data.accessToken, response.data.refreshToken);
        setUser(response.data.user);
        toast({
          title: 'Registration successful',
          description: 'Welcome to Ecomama!',
        });
        router.push(`/${locale}`);
      } else {
        const errorMessage = response.error?.message || 'Registration failed';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Registration failed',
          description: errorMessage,
        });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
    } finally {
      clearTokens();
      setUser(null);
      router.push(`/${locale}`);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.updateProfile(data);

      if (response.success && response.data && user) {
        setUser({ ...user, profile: response.data });
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully.',
        });
      } else {
        const errorMessage = response.error?.message || 'Profile update failed';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Update failed',
          description: errorMessage,
        });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (data: ChangePasswordRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.changePassword(data);

      if (response.success) {
        toast({
          title: 'Password changed',
          description: 'Your password has been changed successfully.',
        });
      } else {
        const errorMessage = response.error?.message || 'Password change failed';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Password change failed',
          description: errorMessage,
        });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
