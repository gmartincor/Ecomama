'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCommunityStore } from "@/lib/stores/useCommunityStore";
import { useListings } from "@/features/listings/hooks/useListings";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ActionButton } from "@/components/ui/ActionButton";
import { TabNavigation } from "@/features/dashboard/components";
import { ListingGrid, ListingFilters } from "@/features/listings/components";
import { PageError } from "@/components/common/PageError";
import type { TabConfig } from "@/features/dashboard/types";
import type { ListingStatus } from "@/features/listings/types";

const DASHBOARD_TABS: TabConfig[] = [
  { id: "feed", label: "Feed", href: "/community", icon: "📰" },
  { id: "members", label: "Miembros", href: "/community/members", icon: "👥" },
  { id: "offers", label: "Ofertas", href: "/community/offers", icon: "🌾" },
  { id: "demands", label: "Demandas", href: "/community/demands", icon: "🛒" },
];

export default function CommunityDemandsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeCommunity } = useCommunityStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ListingStatus | undefined>(undefined);

  const communityId = activeCommunity?.id || "";
  const { listings, isLoading, error, deleteListing } = useListings(communityId, {
    type: "DEMAND",
    ...(status && { status }),
    ...(search && { search }),
  });

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

  const handleEdit = (listingId: string) => {
    router.push(`/listings/${listingId}/edit`);
  };

  const handleDelete = async (listingId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta demanda?")) {
      try {
        await deleteListing(listingId);
      } catch (error) {
        alert("Error al eliminar la demanda");
      }
    }
  };

  const handleContactAuthor = (authorId: string) => {
    router.push(`/profile/${authorId}`);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus(undefined);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">Demandas de {activeCommunity.name}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Productos y servicios buscados por los miembros</p>
        </div>
        <ActionButton 
          onClick={() => router.push("/listings/new?type=DEMAND")} 
          className="w-full sm:w-auto text-sm flex-shrink-0"
        >
          + Nueva Demanda
        </ActionButton>
      </div>

      <TabNavigation tabs={DASHBOARD_TABS} />

      <div className="mt-3 sm:mt-4">
        <ListingFilters
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onClearFilters={handleClearFilters}
        />

        {error ? (
          <PageError message={error} />
        ) : (
          <ListingGrid
            listings={listings}
            type="DEMAND"
            isLoading={isLoading}
            currentUserId={user?.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onContactAuthor={handleContactAuthor}
            emptyActionLabel="Crear Primera Demanda"
            onEmptyAction={() => router.push("/listings/new?type=DEMAND")}
          />
        )}
      </div>
    </div>
  );
}
