"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCommunityStore } from "@/lib/stores/useCommunityStore";
import { useEvents } from "@/features/events/hooks/useEvents";
import { EventForm } from "@/features/events/components";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageLoading } from "@/components/common/PageLoading";
import { PageError } from "@/components/common/PageError";
import type { CreateEventData, Event } from "@/features/events/types";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;
  const { activeCommunity } = useCommunityStore();
  const communityId = activeCommunity?.id || "";
  const { updateEvent } = useEvents(communityId);
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

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
    return <PageLoading title="Cargando evento..." />;
  }

  if (error || !event) {
    return (
      <PageError
        message={error || "Evento no encontrado"}
        onBack={() => router.push("/community")}
      />
    );
  }

  const handleSubmit = async (data: CreateEventData) => {
    try {
      await updateEvent(eventId, data);
      router.push("/community");
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    router.push("/community");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Editar Publicación</h1>
        <p className="text-gray-600">
          Edita la publicación de la comunidad {activeCommunity.name}
        </p>
      </div>

      <EventForm initialData={event} onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
