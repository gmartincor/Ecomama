'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { useProfile } from '@/features/profiles/hooks/useProfile';
import { ProfileDetailView } from '@/features/profiles/components/ProfileDetailView';
import { PageLoading } from '@/components/common/PageLoading';
import { PageError } from '@/components/common/PageError';

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const { profile, isLoading, error, refetch } = useProfile(id);

  const handleBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return <PageLoading title="Perfil de Usuario" />;
  }

  if (error) {
    return <PageError message={error} onRetry={refetch} onBack={handleBack} />;
  }

  if (!profile) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Perfil de {profile.user.name}</h1>
          <p className="text-muted-foreground mt-2">
            Información del miembro de la comunidad
          </p>
        </div>

        <ProfileDetailView
          profile={profile}
          isOwnProfile={false}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
