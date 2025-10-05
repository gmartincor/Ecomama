'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCommunityStore } from "@/lib/stores/useCommunityStore";
import { useCommunityStats } from "@/features/dashboard/hooks/useDashboard";
import { useCommunity } from "@/features/communities/hooks/useCommunities";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useEventRegistration } from "@/features/events/hooks/useEventRegistration";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard, TabNavigation, DashboardHeader } from "@/features/dashboard/components";
import { EventFeed } from "@/features/events/components";
import { PageLoading } from "@/components/common/PageLoading";
import { PageError } from "@/components/common/PageError";
import type { TabConfig } from "@/features/dashboard/types";

const DASHBOARD_TABS: TabConfig[] = [
  { id: "feed", label: "Feed", href: "/community", icon: "📰" },
  { id: "members", label: "Miembros", href: "/community/members", icon: "👥" },
  { id: "offers", label: "Ofertas", href: "/community/offers", icon: "🌾" },
  { id: "demands", label: "Demandas", href: "/community/demands", icon: "🛒" },
];

export default function CommunityDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeCommunity } = useCommunityStore();
  const communityId = activeCommunity?.id || "";
  
  const { community, isLoading: loadingCommunity, error: communityError } = useCommunity(communityId);
  const { stats, isLoading: loadingStats, error: statsError } = useCommunityStats(communityId);
  const { events, isLoading: loadingEvents, error: eventsError, togglePinEvent, deleteEvent, refetch: refetchEvents } = useEvents(communityId);
  
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());
  const [attendeesCounts, setAttendeesCounts] = useState<Map<string, number>>(new Map());
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);

  const { isRegistering, register, cancel } = useEventRegistration(() => {
    fetchUserRegistrations();
    refetchEvents();
  });

  const isAdmin = community?.adminId === user?.id;

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

  if (!activeCommunity) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Card className="p-4 sm:p-6 text-center">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            No tienes una comunidad activa seleccionada
          </p>
          <Button onClick={() => router.push("/communities/map")} className="w-full sm:w-auto">
            Explorar Comunidades
          </Button>
        </Card>
      </div>
    );
  }

  if (loadingCommunity) {
    return <PageLoading title="Cargando comunidad..." />;
  }

  if (communityError) {
    return (
      <PageError
        message={communityError}
        onBack={() => router.push("/dashboard")}
      />
    );
  }

  if (!community) {
    return <PageError message="Comunidad no encontrada" onBack={() => router.push("/dashboard")} />;
  }

  if (statsError && statsError.includes('miembro aprobado')) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Card className="p-4 sm:p-6 text-center">
          <p className="text-sm sm:text-base text-red-600 mb-4">
            No tienes acceso a esta comunidad. Tu solicitud de membresía puede estar pendiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={() => router.push("/requests")} className="w-full sm:w-auto">
              Ver Mis Solicitudes
            </Button>
            <Button onClick={() => router.push("/communities/map")} variant="outline" className="w-full sm:w-auto">
              Explorar Comunidades
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleEditEvent = (eventId: string) => {
    router.push(`/admin/community/events/${eventId}/edit`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      try {
        await deleteEvent(eventId);
      } catch (error) {
        alert("Error al eliminar el evento");
      }
    }
  };

  const handleTogglePin = async (eventId: string, isPinned: boolean) => {
    try {
      await togglePinEvent(eventId, isPinned);
    } catch (error) {
      alert("Error al fijar/desfijar el evento");
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      await register(eventId);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al inscribirse");
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    if (window.confirm("¿Estás seguro de que quieres cancelar tu inscripción?")) {
      try {
        await cancel(eventId);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Error al cancelar inscripción");
      }
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <DashboardHeader community={community} />

      {loadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </Card>
          <Card className="p-4 animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </Card>
          <Card className="p-4 animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </Card>
        </div>
      ) : statsError ? (
        <div className="mb-6 sm:mb-8">
          <Card className="p-4 text-center text-red-600">
            <p className="text-sm">Error al cargar estadísticas: {statsError}</p>
          </Card>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Miembros"
            value={stats.membersCount}
            icon="👥"
            onClick={() => router.push("/community/members")}
          />
          <StatCard
            title="Publicaciones Activas"
            value={stats.activeListingsCount}
            icon="📦"
            onClick={() => router.push("/community/offers")}
          />
          <StatCard
            title="Eventos"
            value={stats.eventsCount}
            icon="📅"
          />
        </div>
      ) : null}

      <TabNavigation tabs={DASHBOARD_TABS} />

      <div className="mt-3 sm:mt-4">
        {isAdmin && (
          <div className="mb-4 sm:mb-6 flex justify-end">
            <Button onClick={() => router.push("/admin/community/events/new")} className="w-full sm:w-auto text-sm">
              📝 Crear Publicación
            </Button>
          </div>
        )}

        {eventsError ? (
          <PageError message={eventsError} />
        ) : (
          <EventFeed
            events={events}
            isLoading={loadingEvents || loadingRegistrations}
            isAdmin={isAdmin}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onTogglePin={handleTogglePin}
            onRegister={handleRegister}
            onCancelRegistration={handleCancelRegistration}
            registeredEventIds={registeredEventIds}
            isRegistering={isRegistering}
            attendeesCounts={attendeesCounts}
            emptyMessage="No hay publicaciones aún"
            emptyActionLabel={isAdmin ? "Crear Primera Publicación" : undefined}
            onEmptyAction={isAdmin ? () => router.push("/admin/community/events/new") : undefined}
          />
        )}
      </div>
    </div>
  );
}
