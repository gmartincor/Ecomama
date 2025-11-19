"use client";

import { useRouter } from "next/navigation";
import { useEvents } from "@/features/events/hooks/useEvents";
import { EventForm } from "@/features/events/components";
import { Button } from "@/components/ui/Button";
import type { CreateEventData } from "@/features/events/types";

export default function CreateEventPage() {
  const router = useRouter();
  const { createEvent } = useEvents();

  const handleSubmit = async (data: CreateEventData) => {
    try {
      await createEvent(data);
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
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          ← Volver
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Crear Evento</h1>
        <p className="text-muted-foreground">
          Comparte un evento o anuncio con toda la comunidad
        </p>
      </div>

      <EventForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
