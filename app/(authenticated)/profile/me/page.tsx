'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ProfileDetailView } from '@/features/profiles/components/ProfileDetailView';
import { PageLoading } from '@/components/common/PageLoading';
import { PageError } from '@/components/common/PageError';
import type { ProfileWithUser } from '@/features/profiles/types';

export default function MyProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/users/me/profile');
      
      if (!response.ok) {
        throw new Error('Error al cargar el perfil');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => {
    router.push('/profile/me/edit');
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return <PageLoading title="Mi Perfil" />;
  }

  if (error || !profile) {
    return (
      <PageError
        message={error || 'No se pudo cargar el perfil'}
        onRetry={fetchProfile}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground mt-2">
            Visualiza y edita tu información personal
          </p>
        </div>

        <ProfileDetailView
          profile={profile}
          isOwnProfile={true}
          onEdit={handleEdit}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
