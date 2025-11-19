"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useListings } from "@/features/listings/hooks/useListings";
import { ListingForm } from "@/features/listings/components";
import type { CreateListingData, ListingType } from "@/features/listings/types";

export const dynamic = 'force-dynamic';

export default function CreateListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createListing } = useListings();

  const type = (searchParams.get("type") || "OFFER") as ListingType;

  const handleSubmit = async (data: CreateListingData) => {
    try {
      await createListing(data);
      router.push("/listings");
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    router.push("/listings");
  };

  const title = type === "OFFER" ? "Nueva Oferta" : "Nueva Demanda";
  const description = type === "OFFER" 
    ? "Comparte productos o servicios que puedes ofrecer" 
    : "Solicita productos o servicios que necesitas";

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <ListingForm type={type} onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
