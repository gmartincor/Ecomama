import { prisma } from '@/lib/prisma/client';
import { PasswordService } from '@/lib/utils/password';
import type { AuthUser, ValidateCredentialsParams } from '../types';

const USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  status: true,
} as const;

const USER_SELECT_WITH_PASSWORD = {
  ...USER_SELECT,
  passwordHash: true,
} as const;

const toAuthUser = (user: { id: string; email: string; name: string; role: any }): AuthUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
});

export const authService = {
  async validateCredentials({ email, password }: ValidateCredentialsParams): Promise<AuthUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: USER_SELECT_WITH_PASSWORD,
      });

      if (!user || user.status !== 'ACTIVE') {
        return null;
      }

      const isPasswordValid = await PasswordService.verify(password, user.passwordHash);

      if (!isPasswordValid) {
        return null;
      }

      return toAuthUser(user);
    } catch (error) {
      console.error('[AuthService] Error validating credentials:', error);
      return null;
    }
  },

  async getUserById(userId: string): Promise<AuthUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: USER_SELECT,
      });

      if (!user || user.status !== 'ACTIVE') {
        return null;
      }

      return toAuthUser(user);
    } catch (error) {
      console.error('[AuthService] Error getting user by ID:', error);
      return null;
    }
  },
};
