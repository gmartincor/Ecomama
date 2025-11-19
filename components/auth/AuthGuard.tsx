'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { PageLoading } from '@/components/common';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'USER' | 'SUPERADMIN';
}

const PUBLIC_PATHS = ['/', '/login', '/register', '/legal/privacy', '/legal/terms'];

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    const isPublicPath = PUBLIC_PATHS.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );

    if (!session && !isPublicPath) {
      const url = new URL('/login', window.location.origin);
      url.searchParams.set('callbackUrl', pathname);
      router.push(url.toString());
      return;
    }

    if (session && (pathname === '/login' || pathname === '/register')) {
      const redirectPath = session.user.role === 'SUPERADMIN' 
        ? '/superadmin/dashboard' 
        : '/tablon';
      router.push(redirectPath);
      return;
    }

    if (requiredRole && session?.user.role !== requiredRole) {
      router.push('/tablon');
      return;
    }
  }, [session, status, pathname, router, requiredRole]);

  if (status === 'loading') {
    return <PageLoading />;
  }

  const isPublicPath = PUBLIC_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!session && !isPublicPath) {
    return <PageLoading />;
  }

  if (requiredRole && session?.user.role !== requiredRole) {
    return <PageLoading />;
  }

  return <>{children}</>;
}
