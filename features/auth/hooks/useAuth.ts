'use client';

import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';

export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;

  const hasRole = (role: UserRole) => {
    return user?.role === role;
  };

  const isSuperAdmin = hasRole('SUPERADMIN');
  const isAdmin = hasRole('ADMIN');
  const isUser = hasRole('USER');

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    hasRole,
    isSuperAdmin,
    isAdmin,
    isUser,
  };
}
