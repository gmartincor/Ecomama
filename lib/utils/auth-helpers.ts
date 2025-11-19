import { auth } from '@/lib/auth/config';
import { UserRole } from '@prisma/client';
import { UnauthorizedError, ForbiddenError } from '@/lib/utils/api-response';

export type AuthenticatedSession = {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
};

export const getAuthenticatedSession = async (): Promise<AuthenticatedSession | null> => {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  return session as AuthenticatedSession;
};

export const requireAuth = async (): Promise<AuthenticatedSession> => {
  const session = await getAuthenticatedSession();
  
  if (!session) {
    throw new UnauthorizedError();
  }

  return session;
};

export const requireRole = async (role: UserRole): Promise<AuthenticatedSession> => {
  const session = await requireAuth();

  if (session.user.role !== role) {
    throw new ForbiddenError();
  }

  return session;
};

export const requireRoles = async (roles: UserRole[]): Promise<AuthenticatedSession> => {
  const session = await requireAuth();

  if (!roles.includes(session.user.role)) {
    throw new ForbiddenError();
  }

  return session;
};
