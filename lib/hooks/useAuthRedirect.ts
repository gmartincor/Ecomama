import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCommunityStore } from '@/lib/stores/useCommunityStore';

export function useAuthRedirect() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { userCommunities, isInitialized } = useCommunityStore();

  useEffect(() => {
    if (status === 'loading' || !isInitialized) {
      return;
    }

    if (!session?.user) {
      return;
    }

    const user = session.user;

    if (user.role === 'SUPERADMIN') {
      router.push('/superadmin/dashboard');
      return;
    }

    if (userCommunities.length === 0) {
      router.push('/communities/map');
      return;
    }

    router.push('/community');
  }, [session, status, userCommunities, isInitialized, router]);

  return {
    isReady: status !== 'loading' && isInitialized,
    shouldRedirect: !!session?.user,
  };
}
