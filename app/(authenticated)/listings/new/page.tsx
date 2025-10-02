"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCommunityStore } from "@/lib/stores/useCommunityStore";
import { useListings } from "@/features/listings/hooks/useListings";
import { ListingForm } from "@/features/listings/components";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { CreateListingData, ListingType } from "@/features/listings/types";

export default function CreateListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeCommunity } = useCommunityStore();
  const communityId = activeCommunity?.id || "";
  const { createListing } = useListings(communityId);

  const type = (searchParams.get("type") || "OFFER") as ListingType;

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

  const handleSubmit = async (data: CreateListingData) => {
    try {
      await createListing(data);
      const redirectPath = type === "OFFER" ? "/community/offers" : "/community/demands";
      router.push(redirectPath);
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    const redirectPath = type === "OFFER" ? "/community/offers" : "/community/demands";
    router.push(redirectPath);
  };

  const title = type === "OFFER" ? "Nueva Oferta" : "Nueva Demanda";
  const description = type === "OFFER" 
    ? "Comparte productos o servicios que puedes ofrecer a la comunidad" 
    : "Solicita productos o servicios que necesitas de la comunidad";

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      <ListingForm type={type} onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
