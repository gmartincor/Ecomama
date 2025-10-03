'use client';

import { useRouter } from "next/navigation";
import { useCommunityStore } from "@/lib/stores/useCommunityStore";
import { useCommunityStats } from "@/features/dashboard/hooks/useDashboard";
import { useCommunity } from "@/features/communities/hooks/useCommunities";
import { useEvents } from "@/features/events/hooks/useEvents";
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
  const { events, isLoading: loadingEvents, error: eventsError, togglePinEvent, deleteEvent } = useEvents(communityId);

  const isAdmin = community?.adminId === user?.id;

  if (!activeCommunity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            No tienes una comunidad activa seleccionada
          </p>
          <Button onClick={() => router.push("/communities/map")}>
            Explorar Comunidades
          </Button>
        </Card>
      </div>
    );
  }

  if (loadingCommunity || loadingStats) {
    return <PageLoading title="Cargando dashboard..." />;
  }

  if (communityError || statsError) {
    return (
      <PageError
        message={communityError || statsError || "Error al cargar el dashboard"}
        onBack={() => router.push("/dashboard")}
      />
    );
  }

  if (!community) {
    return <PageError message="Comunidad no encontrada" onBack={() => router.push("/dashboard")} />;
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

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader community={community} />

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      )}

      <TabNavigation tabs={DASHBOARD_TABS} />

      <div className="mt-8">
        {isAdmin && (
          <div className="mb-6 flex justify-end">
            <Button onClick={() => router.push("/admin/community/events/new")}>
              📝 Crear Publicación
            </Button>
          </div>
        )}

        {eventsError ? (
          <PageError message={eventsError} />
        ) : (
          <EventFeed
            events={events}
            isLoading={loadingEvents}
            isAdmin={isAdmin}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onTogglePin={handleTogglePin}
            emptyMessage="No hay publicaciones aún"
            emptyActionLabel={isAdmin ? "Crear Primera Publicación" : undefined}
            onEmptyAction={isAdmin ? () => router.push("/admin/community/events/new") : undefined}
          />
        )}
      </div>
    </div>
  );
}
