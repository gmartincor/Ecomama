import { UserRole } from '@prisma/client';
import { AuthenticatedSession } from '@/lib/utils/auth-helpers';

type AuthorizationContext = {
  session?: AuthenticatedSession;
  params?: Record<string, any>;
};

export type AuthorizationCheck = (context: AuthorizationContext) => Promise<boolean>;

export const requireRole = (...roles: UserRole[]): AuthorizationCheck => {
  return async ({ session }) => {
    if (!session) return false;
    return roles.includes(session.user.role);
  };
};

export const requireSuperAdmin: AuthorizationCheck = requireRole(UserRole.SUPERADMIN);

export const requireAdmin: AuthorizationCheck = requireRole(UserRole.ADMIN, UserRole.SUPERADMIN);

export const combineChecks = (...checks: AuthorizationCheck[]): AuthorizationCheck => {
  return async (context) => {
    for (const check of checks) {
      if (await check(context)) {
        return true;
      }
    }
    return false;
  };
};

export const allChecks = (...checks: AuthorizationCheck[]): AuthorizationCheck => {
  return async (context) => {
    for (const check of checks) {
      if (!(await check(context))) {
        return false;
      }
    }
    return true;
  };
};
