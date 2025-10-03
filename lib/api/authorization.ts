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

export const createResourceOwnerCheck = (
  getOwnerId: (context: AuthorizationContext) => Promise<string>
): AuthorizationCheck => {
  return async (context) => {
    if (!context.session) return false;
    
    const isSuperAdmin = context.session.user.role === UserRole.SUPERADMIN;
    if (isSuperAdmin) return true;

    const ownerId = await getOwnerId(context);
    return context.session.user.id === ownerId;
  };
};

export const createCommunityAdminCheck = (
  getCommunityId: (context: AuthorizationContext) => Promise<string>,
  isUserCommunityAdmin: (userId: string, communityId: string) => Promise<boolean>
): AuthorizationCheck => {
  return async (context) => {
    if (!context.session) return false;

    const isSuperAdmin = context.session.user.role === UserRole.SUPERADMIN;
    if (isSuperAdmin) return true;

    const communityId = await getCommunityId(context);
    return await isUserCommunityAdmin(context.session.user.id, communityId);
  };
};

export const createCommunityMemberCheck = (
  getCommunityId: (context: AuthorizationContext) => Promise<string>,
  isUserMember: (userId: string, communityId: string) => Promise<boolean>
): AuthorizationCheck => {
  return async (context) => {
    if (!context.session) return false;

    const communityId = await getCommunityId(context);
    return await isUserMember(context.session.user.id, communityId);
  };
};

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
