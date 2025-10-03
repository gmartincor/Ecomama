import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma/client';
import type { AuthUser, ValidateCredentialsParams } from '../types';

export const authService = {
  async validateCredentials({ email, password }: ValidateCredentialsParams): Promise<AuthUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          name: true,
          role: true,
          status: true,
        },
      });

      if (!user) {
        return null;
      }

      if (user.status !== 'ACTIVE') {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      console.error('[AuthService] Error validating credentials:', error);
      return null;
    }
  },

  async getUserById(userId: string): Promise<AuthUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
        },
      });

      if (!user || user.status !== 'ACTIVE') {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      console.error('[AuthService] Error getting user by ID:', error);
      return null;
    }
  },
};
