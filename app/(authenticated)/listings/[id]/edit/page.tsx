"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCommunityStore } from "@/lib/stores/useCommunityStore";
import { useListings } from "@/features/listings/hooks/useListings";
import { ListingForm } from "@/features/listings/components";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageLoading } from "@/components/common/PageLoading";
import { PageError } from "@/components/common/PageError";
import type { CreateListingData, Listing } from "@/features/listings/types";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params?.id as string;
  const { activeCommunity } = useCommunityStore();
  const communityId = activeCommunity?.id || "";
  const { updateListing } = useListings(communityId);
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return;

      try {
        const response = await fetch(`/api/listings/${listingId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch listing");
        }
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (!activeCommunity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            No tienes una comunidad activa seleccionada
          </p>
          <Button onClick={() => router.push("/communities/map")}>
            Explorar Comunidades
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <PageLoading title="Cargando publicación..." />;
  }

  if (error || !listing) {
    return (
      <PageError
        message={error || "Publicación no encontrada"}
        onBack={() => router.push("/community")}
      />
    );
  }

  const handleSubmit = async (data: CreateListingData) => {
    try {
      await updateListing(listingId, data);
      const redirectPath = listing.type === "OFFER" ? "/community/offers" : "/community/demands";
      router.push(redirectPath);
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    const redirectPath = listing.type === "OFFER" ? "/community/offers" : "/community/demands";
    router.push(redirectPath);
  };

  const title = listing.type === "OFFER" ? "Editar Oferta" : "Editar Demanda";

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">Actualiza la información de tu publicación</p>
      </div>

      <ListingForm
        type={listing.type}
        initialData={listing}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
