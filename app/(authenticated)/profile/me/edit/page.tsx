'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { ProfileEditForm } from '@/features/profiles/components/ProfileEditForm';
import { ProfileUpdateInput } from '@/features/profiles/types';
import { PageLoading } from '@/components/common/PageLoading';
import { PageError } from '@/components/common/PageError';

export default function EditProfilePage() {
  const router = useRouter();
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
        isPublic: data.isPublic ?? true,
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
    router.push('/settings');
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return <PageLoading title="Editar Perfil" />;
  }

  if (error || !profile) {
    return <PageError message={error || 'Error al cargar el perfil'} onRetry={fetchProfile} onBack={handleCancel} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Editar Perfil</h1>
          <p className="text-muted-foreground mt-2">
            Actualiza tu información personal visible para otros miembros
          </p>
        </div>

        <Card className="p-6">
          <ProfileEditForm 
            initialData={profile} 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </Card>
      </div>
    </div>
  );
}
