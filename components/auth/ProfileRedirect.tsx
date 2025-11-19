'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useProfileCheck } from '@/features/profiles/hooks/useProfileCheck';

const PROFILE_EDIT_PATH = '/profile/me/edit';
const EXCLUDED_PATHS = [PROFILE_EDIT_PATH, '/profile/me'];

export function ProfileRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { profileStatus, loading } = useProfileCheck();

  useEffect(() => {
    if (loading || !profileStatus) return;

    const isExcludedPath = EXCLUDED_PATHS.some(path => pathname.startsWith(path));
    
    if (!profileStatus.isComplete && !isExcludedPath) {
      router.push(`${PROFILE_EDIT_PATH}?firstTime=true`);
    }
  }, [profileStatus, loading, pathname, router]);

  return <>{children}</>;
}
