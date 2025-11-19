"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useListings } from "@/features/listings/hooks/useListings";
import { ListingGrid, ListingFiltersPanel } from "@/features/listings/components";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageLoading } from "@/components/common/PageLoading";
import { PageError } from "@/components/common/PageError";
import type { ListingFilters, ListingStatus } from "@/features/listings/types";

export default function ListingsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ListingFilters>({ status: 'ACTIVE' });
  const { listings, isLoading, error, deleteListing } = useListings(filters);

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleStatusChange = (status: ListingStatus | undefined) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const handleClearFilters = () => {
    setFilters({ status: 'ACTIVE' });
  };

  const handleDeleteListing = async (listingId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      await deleteListing(listingId);
    }
  };

  const handleViewDetails = (listingId: string) => {
    router.push(`/listings/${listingId}`);
  };

  if (isLoading && !listings.length) {
    return <PageLoading title="Cargando anuncios..." />;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Anuncios</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Ofertas y demandas de la comunidad
            </p>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => router.push("/listings/new?type=OFFER")}
              className="flex-1 sm:flex-none text-sm"
            >
              + Oferta
            </Button>
            <Button
              onClick={() => router.push("/listings/new?type=DEMAND")}
              variant="outline"
              className="flex-1 sm:flex-none text-sm"
            >
              + Demanda
            </Button>
          </div>
        </div>

        <ListingFiltersPanel
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {error ? (
        <PageError message={error} />
      ) : listings.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No hay anuncios disponibles</p>
          <Button onClick={() => router.push("/listings/new?type=OFFER")}>
            Crear Primer Anuncio
          </Button>
        </Card>
      ) : (
        <ListingGrid
          listings={listings}
          onEdit={(id) => router.push(`/listings/${id}/edit`)}
          onDelete={handleDeleteListing}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
}
