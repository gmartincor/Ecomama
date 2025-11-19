'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFetch } from '@/lib/hooks';
import { ProfileDetailView } from '@/features/profiles/components/ProfileDetailView';
import { useProfileCompletion } from '@/features/profiles/hooks';
import { PageLoading } from '@/components/common/PageLoading';
import { PageError } from '@/components/common/PageError';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useUserEvents } from '@/features/events/hooks/useUserEvents';
import { UserEventCard } from '@/features/events/components/UserEventCard';
import { UserEventsCalendar } from '@/features/events/components/UserEventsCalendar';
import type { ProfileWithUser } from '@/features/profiles/types';

export default function MyProfilePage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const { data: profile, isLoading, error, refetch } = useFetch<ProfileWithUser>({
    endpoint: '/api/users/me/profile',
    getErrorMessage: () => 'Error al cargar el perfil',
  });

  const { isComplete, completionPercentage } = useProfileCompletion(profile || null);
  const { events, isLoading: eventsLoading, error: eventsError } = useUserEvents();

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
        onRetry={refetch}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground mt-2">
            Visualiza y edita tu información personal
          </p>
        </div>

        {!isComplete && (
          <Alert variant="warning">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Perfil incompleto ({completionPercentage}%)</p>
                <p className="text-sm mt-1">
                  Completa tu perfil para que los administradores puedan conocerte mejor antes de aceptar tu solicitud a una comunidad.
                </p>
              </div>
              <Button onClick={handleEdit} size="sm" variant="primary">
                Completar ahora
              </Button>
            </div>
          </Alert>
        )}

        <ProfileDetailView
          profile={profile}
          isOwnProfile={true}
          onEdit={handleEdit}
          onBack={handleBack}
        />

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>🎫</span>
                Mis Eventos
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {events.length} {events.length === 1 ? 'evento' : 'eventos'} próximos
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'calendar' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                📅 Calendario
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                📋 Lista
              </Button>
            </div>
          </div>

          {eventsLoading && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Cargando eventos...</p>
            </Card>
          )}

          {eventsError && (
            <Card className="p-8 text-center">
              <p className="text-red-600">{eventsError}</p>
            </Card>
          )}

          {!eventsLoading && !eventsError && events.length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-4xl mb-4">🎫</div>
              <p className="text-muted-foreground mb-2">
                No estás inscrito en ningún evento
              </p>
              <p className="text-sm text-muted-foreground">
                Explora las comunidades para descubrir eventos interesantes
              </p>
            </Card>
          )}

          {!eventsLoading && !eventsError && events.length > 0 && (
            <>
              {viewMode === 'calendar' && <UserEventsCalendar events={events} />}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {events.map((event) => (
                    <UserEventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
