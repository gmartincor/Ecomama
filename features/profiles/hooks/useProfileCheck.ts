import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface ProfileCompletionStatus {
  isComplete: boolean;
  missingFields: string[];
}

export function useProfileCheck() {
  const { data: session, status } = useSession();
  const [profileStatus, setProfileStatus] = useState<ProfileCompletionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (status === 'loading') return;

      if (!session?.user || session.user.role === 'SUPERADMIN') {
        setProfileStatus({ isComplete: true, missingFields: [] });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/users/me/profile/status');
        
        if (!response.ok) {
          console.error('Failed to fetch profile status');
          setProfileStatus({ isComplete: true, missingFields: [] });
          return;
        }

        const data = await response.json();
        setProfileStatus(data);
      } catch (error) {
        console.error('Error checking profile completion:', error);
        setProfileStatus({ isComplete: true, missingFields: [] });
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [session, status]);

  return { profileStatus, loading };
}
