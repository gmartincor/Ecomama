'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { ProfileEditForm } from '@/features/profiles/components/ProfileEditForm';
import { ProfileUpdateInput } from '@/features/profiles/types';
import { PageLoading } from '@/components/common/PageLoading';
import { PageError } from '@/components/common/PageError';
import { Alert } from '@/components/ui/Alert';

export const dynamic = 'force-dynamic';

export default function EditProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstTime = searchParams.get('firstTime') === 'true';
  
  const [profile, setProfile] = useState<ProfileUpdateInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/users/me/profile');
      
      if (!response.ok) {
        throw new Error('Error al cargar el perfil');
      }

      const data = await response.json();
      setProfile({
        bio: data.bio || '',
        phone: data.phone || '',
        location: data.location || '',
        avatar: data.avatar || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSuccess = () => {
    router.push('/feed');
    router.refresh();
  };

  const handleCancel = () => {
    if (isFirstTime) {
      return;
    }
    router.back();
  };

  if (loading) {
    return <PageLoading title="Editar Perfil" />;
  }

  if (error || !profile) {
    return <PageError message={error || 'Error al cargar el perfil'} onRetry={fetchProfile} onBack={!isFirstTime ? handleCancel : undefined} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {isFirstTime ? '¡Bienvenido! Completa tu perfil' : 'Editar Perfil'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isFirstTime 
              ? 'Completa tu información para que otros miembros de la comunidad puedan conocerte mejor'
              : 'Actualiza tu información personal visible para otros miembros'
            }
          </p>
        </div>

        {isFirstTime && (
          <Alert variant="info" className="mb-6">
            Completa tu perfil para comenzar a interactuar con la comunidad. Los campos importantes son: biografía, teléfono y ubicación.
          </Alert>
        )}

        <Card className="p-6">
          <ProfileEditForm 
            initialData={profile} 
            onSuccess={handleSuccess}
            onCancel={!isFirstTime ? handleCancel : undefined}
          />
        </Card>
      </div>
    </div>
  );
}
