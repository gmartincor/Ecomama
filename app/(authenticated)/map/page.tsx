"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useMapData } from "@/features/map/hooks";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageError } from "@/components/common/PageError";
import type { MapFilters, MapItem } from "@/features/map/types";

const GlobalMap = dynamic(
  () => import("@/features/map/components").then((mod) => mod.GlobalMap),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
  }
);

export default function MapPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<MapFilters>({
    includeEvents: true,
    includeListings: true,
  });
  const { events, listings, isLoading, error } = useMapData(filters);
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);

  const handleToggleEvents = () => {
    setFilters(prev => ({
      ...prev,
      includeEvents: !prev.includeEvents,
    }));
  };

  const handleToggleListings = () => {
    setFilters(prev => ({
      ...prev,
      includeListings: !prev.includeListings,
    }));
  };

  const handleViewDetails = () => {
    if (!selectedItem) return;
    
    if (selectedItem.itemType === 'event') {
      router.push(`/events/${selectedItem.id}`);
    } else {
      router.push(`/listings/${selectedItem.id}`);
    }
  };

  if (error) {
    return <PageError message={error} />;
  }

  const hasNoData = events.length === 0 && listings.length === 0;
  const hasNoFilteredData = 
    (filters.includeEvents && !filters.includeListings && events.length === 0) ||
    (!filters.includeEvents && filters.includeListings && listings.length === 0) ||
    (!filters.includeEvents && !filters.includeListings);

  const displayEvents = filters.includeEvents ? events : [];
  const displayListings = filters.includeListings ? listings : [];
  const showLoading = isLoading && events.length === 0 && listings.length === 0;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Mapa Global</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Explora eventos y anuncios en el mapa
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant={filters.includeEvents ? "default" : "outline"}
              size="sm"
              onClick={handleToggleEvents}
              className="flex-1 sm:flex-none text-xs sm:text-sm"
            >
              📅 Eventos ({events.length})
            </Button>
            <Button
              variant={filters.includeListings ? "default" : "outline"}
              size="sm"
              onClick={handleToggleListings}
              className="flex-1 sm:flex-none text-xs sm:text-sm"
            >
              📦 Anuncios ({listings.length})
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-2 sm:px-4 pb-2 sm:pb-4">
        <Card className="h-full p-0 overflow-hidden">
          {showLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-16 w-16 bg-muted rounded-full mx-auto" />
                  <div className="h-4 bg-muted rounded w-32 mx-auto" />
                </div>
              </div>
            </div>
          ) : hasNoData ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <p className="text-lg font-semibold text-muted-foreground mb-2">
                  No hay datos disponibles
                </p>
                <p className="text-sm text-muted-foreground">
                  Aún no hay eventos ni anuncios con ubicación
                </p>
              </div>
            </div>
          ) : hasNoFilteredData ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <p className="text-lg font-semibold text-muted-foreground mb-2">
                  Sin resultados
                </p>
                <p className="text-sm text-muted-foreground">
                  Selecciona al menos un filtro para ver el mapa
                </p>
              </div>
            </div>
          ) : (
            <GlobalMap
              events={displayEvents}
              listings={displayListings}
              onItemClick={setSelectedItem}
            />
          )}
        </Card>
      </div>

      {selectedItem && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-96 z-[1000]">
          <Card className="p-4 shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-sm sm:text-base">{selectedItem.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedItem.itemType === 'event' ? '📅 Evento' : '📦 Anuncio'}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <p className="text-xs sm:text-sm mb-3">
              {selectedItem.description.substring(0, 150)}
              {selectedItem.description.length > 150 ? '...' : ''}
            </p>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">
                👤 {selectedItem.author.name}
              </span>
              <Button size="sm" className="text-xs" onClick={handleViewDetails}>
                Ver detalles
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
