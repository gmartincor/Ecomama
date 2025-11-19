"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useEventRegistration } from "@/features/events/hooks/useEventRegistration";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EventFeed } from "@/features/events/components";
import { PageLoading } from "@/components/common/PageLoading";
import { PageError } from "@/components/common/PageError";
import { useGlobalStats } from "@/lib/hooks/useGlobalStats";

export default function TablonPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { stats } = useGlobalStats();
  const { events, isLoading: loadingEvents, error: eventsError, togglePinEvent, deleteEvent, refetch: refetchEvents } = useEvents();
  
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());
  const [attendeesCounts, setAttendeesCounts] = useState<Map<string, number>>(new Map());
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);

  const { isRegistering, register, cancel } = useEventRegistration(() => {
    fetchUserRegistrations();
    refetchEvents();
  });

  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const fetchUserRegistrations = useCallback(async () => {
    if (!user?.id || events.length === 0) {
      setLoadingRegistrations(false);
      return;
    }

    try {
      const registrationsPromises = events.map(async (event) => {
        const [isRegistered, count] = await Promise.all([
          fetch(`/api/events/${event.id}/registration-status`).then(r => r.ok ? r.json().then(d => d.isRegistered) : false),
          fetch(`/api/events/${event.id}/attendees-count`).then(r => r.ok ? r.json().then(d => d.count) : 0),
        ]);
        return { eventId: event.id, isRegistered, count };
      });

      const results = await Promise.all(registrationsPromises);
      
      const newRegisteredIds = new Set<string>();
      const newCounts = new Map<string, number>();
      
      results.forEach(({ eventId, isRegistered, count }) => {
        if (isRegistered) newRegisteredIds.add(eventId);
        newCounts.set(eventId, count);
      });

      setRegisteredEventIds(newRegisteredIds);
      setAttendeesCounts(newCounts);
    } finally {
      setLoadingRegistrations(false);
    }
  }, [user?.id, events]);

  useEffect(() => {
    if (events.length > 0 && user?.id) {
      fetchUserRegistrations();
    } else {
      setLoadingRegistrations(false);
    }
  }, [fetchUserRegistrations, events.length, user?.id]);

  const handleEditEvent = (eventId: string) => {
    router.push(`/events/${eventId}/edit`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      await deleteEvent(eventId);
    }
  };

  const handleTogglePin = async (eventId: string, isPinned: boolean) => {
    await togglePinEvent(eventId, isPinned);
  };

  const handleRegister = async (eventId: string) => {
    await register(eventId);
  };

  const handleCancelRegistration = async (eventId: string) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar tu inscripción?")) {
      await cancel(eventId);
    }
  };

  if (loadingEvents && !events.length) {
    return <PageLoading title="Cargando tablón..." />;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tablón Global</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Eventos y noticias de toda la comunidad
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="p-3 sm:p-4 text-center">
            <div className="text-xs sm:text-sm text-muted-foreground mb-1">Usuarios</div>
            <div className="text-xl sm:text-2xl font-bold">{stats.totalUsers}</div>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <div className="text-xs sm:text-sm text-muted-foreground mb-1">Publicaciones</div>
            <div className="text-xl sm:text-2xl font-bold">{stats.activeListings}</div>
          </Card>
          <Card className="p-3 sm:p-4 text-center">
            <div className="text-xs sm:text-sm text-muted-foreground mb-1">Eventos</div>
            <div className="text-xl sm:text-2xl font-bold">{stats.upcomingEvents}</div>
          </Card>
        </div>
      )}

      <div className="mb-4 sm:mb-6 flex justify-end">
        <Button onClick={() => router.push("/events/new")} className="w-full sm:w-auto text-sm">
          📝 Crear Evento
        </Button>
      </div>

      {eventsError ? (
        <PageError message={eventsError} />
      ) : (
        <EventFeed
          events={events}
          isLoading={loadingEvents || loadingRegistrations}
          isAdmin={isSuperAdmin}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onTogglePin={handleTogglePin}
          onRegister={handleRegister}
          onCancelRegistration={handleCancelRegistration}
          registeredEventIds={registeredEventIds}
          isRegistering={isRegistering}
          attendeesCounts={attendeesCounts}
          emptyMessage="No hay eventos aún"
          emptyActionLabel="Crear Primer Evento"
          onEmptyAction={() => router.push("/events/new")}
        />
      )}
    </div>
  );
}
