"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/hooks";
import { ListingDetailView } from "@/features/listings/components";
import { PageLoading } from "@/components/common/PageLoading";
import { PageError } from "@/components/common/PageError";
import type { ListingWithAuthor } from "@/features/listings/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function ListingDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [listingId, setListingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    params.then(p => setListingId(p.id));
  }, [params]);

  const { data: listing, isLoading, error, refetch } = useFetch<ListingWithAuthor>({
    endpoint: listingId ? `/api/listings/${listingId}` : "",
    autoFetch: !!listingId,
    getErrorMessage: () => "Error al cargar el anuncio",
  });

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    if (!listing) return;
    router.push(`/listings/${listing.id}/edit`);
  };

  const handleDelete = async () => {
    if (!listing) return;

    if (!confirm("¿Estás seguro de que quieres eliminar este anuncio?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el anuncio");
      }

      router.push("/listings");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar el anuncio");
      setIsDeleting(false);
    }
  };

  const handleViewAuthorProfile = () => {
    if (!listing) return;
    router.push(`/profile/${listing.author.id}`);
  };

  const isAuthor = session?.user?.id === listing?.authorId;

  if (isLoading || !listingId) {
    return <PageLoading title="Cargando anuncio..." />;
  }

  if (error || !listing) {
    return (
      <PageError
        message={error || "No se pudo cargar el anuncio"}
        onRetry={refetch}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ListingDetailView
          listing={listing}
          onBack={handleBack}
          onEdit={isAuthor ? handleEdit : undefined}
          onDelete={isAuthor && !isDeleting ? handleDelete : undefined}
          onViewAuthorProfile={handleViewAuthorProfile}
          isAuthor={isAuthor}
        />
      </div>
    </div>
  );
}
