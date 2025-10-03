"use client";

import { useRouter } from "next/navigation";
import { useCommunityStore } from "@/lib/stores/useCommunityStore";
import { useEvents } from "@/features/events/hooks/useEvents";
import { EventForm } from "@/features/events/components";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageLoading } from "@/components/common/PageLoading";
import type { CreateEventData } from "@/features/events/types";

export default function CreateEventPage() {
  const router = useRouter();
  const { activeCommunity } = useCommunityStore();
  const communityId = activeCommunity?.id || "";
  const { createEvent } = useEvents(communityId);

  if (!activeCommunity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            No tienes una comunidad activa seleccionada
          </p>
          <Button onClick={() => router.push("/communities/map")}>
            Explorar Comunidades
          </Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (data: CreateEventData) => {
    try {
      await createEvent(data);
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
        <h1 className="text-3xl font-bold mb-2">Nueva Publicación</h1>
        <p className="text-muted-foreground">
          Crea un evento, anuncio o noticia para la comunidad {activeCommunity.name}
        </p>
      </div>

      <EventForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
