'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileDetailView } from '@/features/profiles/components/ProfileDetailView';
import { PageLoading } from '@/components/common/PageLoading';
import { PageError } from '@/components/common/PageError';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUserEvents } from '@/features/events/hooks/useUserEvents';
import { UserEventCard } from '@/features/events/components/UserEventCard';
import { UserEventsCalendar } from '@/features/events/components/UserEventsCalendar';
import type { ProfileWithUser } from '@/features/profiles/types';

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const { events, isLoading: eventsLoading, error: eventsError } = useUserEvents();

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
      <div className="max-w-4xl mx-auto space-y-8">
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
