import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { AddressInput } from "@/components/ui/AddressInput";
import { Alert } from "@/components/ui/Alert";
import { EventTypeSelector } from "./EventTypeSelector";
import type { EventType, CreateEventData, Event } from "../types";

type EventFormProps = {
  initialData?: Event;
  onSubmit: (data: CreateEventData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export const EventForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: EventFormProps) => {
  const [type, setType] = useState<EventType>(initialData?.type || "ANNOUNCEMENT");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [eventDate, setEventDate] = useState(
    initialData?.eventDate
      ? new Date(initialData.eventDate).toISOString().slice(0, 16)
      : ""
  );
  const [address, setAddress] = useState("");
  const [locationData, setLocationData] = useState<{
    latitude?: number;
    longitude?: number;
  }>({
    latitude: initialData?.latitude ?? undefined,
    longitude: initialData?.longitude ?? undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLocationChange = (location: { latitude: number; longitude: number } | null) => {
    if (location) {
      setLocationData(location);
    } else {
      setLocationData({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "El título es requerido";
    } else if (title.length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres";
    }

    if (!description.trim()) {
      newErrors.description = "La descripción es requerida";
    } else if (description.length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres";
    }

    if (type === "EVENT" && !eventDate) {
      newErrors.eventDate = "Los eventos deben tener una fecha";
    }

    if (type === "EVENT" && !address.trim()) {
      newErrors.address = "La ubicación es requerida para eventos";
    }

    if (type === "EVENT" && (!locationData.latitude || !locationData.longitude)) {
      newErrors.address = "Debes buscar y confirmar la ubicación antes de publicar";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit({
        type,
        title: title.trim(),
        description: description.trim(),
        eventDate: eventDate ? new Date(eventDate) : null,
        location: address.trim() || null,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      });
    } catch (error) {
      setErrors({ submit: "Error al guardar. Intenta nuevamente." });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <EventTypeSelector value={type} onChange={setType} error={errors.type} />

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Título
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de la publicación"
            error={errors.title}
            maxLength={200}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Descripción
          </label>
          <Textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Describe el contenido de la publicación..."
            rows={6}
            error={errors.description}
            maxLength={5000}
            disabled={isLoading}
          />
        </div>

        {type === "EVENT" && (
          <>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Fecha y hora del evento
              </label>
              <Input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                error={errors.eventDate}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Ubicación <span className="text-red-500">*</span>
              </label>
              <AddressInput
                value={address}
                onChange={setAddress}
                onLocationChange={handleLocationChange}
                placeholder="Ej: Madrid, España o Calle Gran Vía 1, Madrid"
                error={errors.address}
                disabled={isLoading}
                required={true}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Escribe la ubicación y presiona el botón 🔍 o Enter para confirmar
              </p>
            </div>
          </>
        )}

        {errors.submit && (
          <Alert variant="destructive">{errors.submit}</Alert>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Publicar"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
