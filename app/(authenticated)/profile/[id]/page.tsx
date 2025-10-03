'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProfile } from '@/features/profiles/hooks/useProfile';
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

  if (isLoading) {
    return <PageLoading />;
  }

  if (error) {
    return <PageError message={error} onRetry={refetch} onBack={() => window.history.back()} />;
  }

  if (!profile) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.user.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-semibold">
                {profile.user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="text-center">
              <h1 className="text-2xl font-bold">{profile.user.name}</h1>
              <p className="text-muted-foreground">{profile.user.email}</p>
            </div>

            {profile.bio && (
              <div className="w-full mt-6">
                <h2 className="text-lg font-semibold mb-2">Biografía</h2>
                <p className="text-foreground whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            <div className="w-full space-y-3 mt-6">
              {profile.phone && (
                <div className="flex items-center space-x-3">
                  <span className="text-muted-foreground font-medium min-w-[100px]">Teléfono:</span>
                  <span className="text-foreground">{profile.phone}</span>
                </div>
              )}

              {profile.location && (
                <div className="flex items-center space-x-3">
                  <span className="text-muted-foreground font-medium min-w-[100px]">Ubicación:</span>
                  <span className="text-foreground">{profile.location}</span>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <span className="text-muted-foreground font-medium min-w-[100px]">Miembro desde:</span>
                <span className="text-foreground">
                  {new Date(profile.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-muted-foreground font-medium min-w-[100px]">Perfil:</span>
                <span className="text-foreground">
                  {profile.isPublic ? 'Público' : 'Privado'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={() => window.history.back()} variant="outline">
                Volver
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
