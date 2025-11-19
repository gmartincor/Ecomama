"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEvents } from "@/features/events/hooks/useEvents";
import { EventForm } from "@/features/events/components";
import { PageLoading } from "@/components/common/PageLoading";
import { PageError } from "@/components/common/PageError";
import type { Event, CreateEventData } from "@/features/events/types";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;
  const { updateEvent } = useEvents();
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

  if (isLoading) {
    return <PageLoading title="Cargando evento..." />;
  }

  if (error || !event) {
    return (
      <PageError
        message={error || "Evento no encontrado"}
        onBack={() => router.push("/feed")}
      />
    );
  }

  const handleSubmit = async (data: CreateEventData) => {
    try {
      await updateEvent(eventId, data);
      router.push("/feed");
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    router.push("/feed");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Editar Evento</h1>
        <p className="text-muted-foreground">Actualiza la información del evento</p>
      </div>

      <EventForm
        initialData={event}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
