"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/hooks";
import { EventDetailView } from "@/features/events/components";
import { PageLoading } from "@/components/common/PageLoading";
import { PageError } from "@/components/common/PageError";
import type { EventWithAuthor } from "@/features/events/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function EventDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [eventId, setEventId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    params.then(p => setEventId(p.id));
  }, [params]);

  const { data: event, isLoading, error, refetch } = useFetch<EventWithAuthor>({
    endpoint: eventId ? `/api/events/${eventId}` : "",
    autoFetch: !!eventId,
    getErrorMessage: () => "Error al cargar el evento",
  });

  const { data: attendeesData } = useFetch<{ count: number }>({
    endpoint: eventId ? `/api/events/${eventId}/attendees-count` : "",
    autoFetch: !!eventId,
  });

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    if (!event) return;
    router.push(`/events/${event.id}/edit`);
  };

  const handleDelete = async () => {
    if (!event) return;

    if (!confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el evento");
      }

      router.push("/tablon");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar el evento");
      setIsDeleting(false);
    }
  };

  const handleViewAuthorProfile = () => {
    if (!event) return;
    router.push(`/profile/${event.author.id}`);
  };

  const isAuthor = session?.user?.id === event?.authorId;

  if (isLoading || !eventId) {
    return <PageLoading title="Cargando evento..." />;
  }

  if (error || !event) {
    return (
      <PageError
        message={error || "No se pudo cargar el evento"}
        onRetry={refetch}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <EventDetailView
          event={event}
          onBack={handleBack}
          onEdit={isAuthor ? handleEdit : undefined}
          onDelete={isAuthor && !isDeleting ? handleDelete : undefined}
          onViewAuthorProfile={handleViewAuthorProfile}
          isAuthor={isAuthor}
          attendeesCount={attendeesData?.count}
        />
      </div>
    </div>
  );
}
