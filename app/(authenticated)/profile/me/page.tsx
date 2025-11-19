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
import { useUserListings } from '@/features/listings/hooks/useUserListings';
import { UserListingCard } from '@/features/listings/components/UserListingCard';
import type { ProfileWithUser } from '@/features/profiles/types';
import type { ListingStatus } from '@/features/listings/types';

export default function MyProfilePage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const { data: profile, isLoading, error, refetch } = useFetch<ProfileWithUser>({
    endpoint: '/api/users/me/profile',
    getErrorMessage: () => 'Error al cargar el perfil',
  });

  const { isComplete, completionPercentage } = useProfileCompletion(profile || null);
  const { events, isLoading: eventsLoading, error: eventsError } = useUserEvents();
  const { 
    listings, 
    isLoading: listingsLoading, 
    error: listingsError,
    deleteListing,
    updateListingStatus
  } = useUserListings();

  const handleEdit = () => {
    router.push('/profile/me/edit');
  };

  const handleBack = () => {
    router.back();
  };

  const handleViewEvent = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      return;
    }

    setIsDeleting(listingId);
    try {
      await deleteListing(listingId);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al eliminar el anuncio');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleStatusChange = async (listingId: string, status: string) => {
    setIsUpdatingStatus(listingId);
    try {
      await updateListingStatus(listingId, status as ListingStatus);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al actualizar el estado');
    } finally {
      setIsUpdatingStatus(null);
    }
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
              {viewMode === 'calendar' && (
                <UserEventsCalendar 
                  events={events} 
                  onView={handleViewEvent}
                />
              )}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {events.map((event) => (
                    <UserEventCard 
                      key={event.id} 
                      event={event} 
                      onView={handleViewEvent}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>📦</span>
              Mis Anuncios
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {listings.length} {listings.length === 1 ? 'anuncio' : 'anuncios'} publicados
            </p>
          </div>

          {listingsLoading && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Cargando anuncios...</p>
            </Card>
          )}

          {listingsError && (
            <Card className="p-8 text-center">
              <p className="text-red-600">{listingsError}</p>
            </Card>
          )}

          {!listingsLoading && !listingsError && listings.length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-4xl mb-4">📦</div>
              <p className="text-muted-foreground mb-2">
                No tienes anuncios publicados
              </p>
              <p className="text-sm text-muted-foreground">
                Crea un anuncio para ofrecer o solicitar productos
              </p>
            </Card>
          )}

          {!listingsLoading && !listingsError && listings.length > 0 && (
            <div className="space-y-4">
              {listings.map((listing) => (
                <UserListingCard
                  key={listing.id}
                  listing={listing}
                  onDelete={isDeleting !== listing.id ? handleDeleteListing : undefined}
                  onStatusChange={handleStatusChange}
                  isUpdating={isUpdatingStatus === listing.id || isDeleting === listing.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
