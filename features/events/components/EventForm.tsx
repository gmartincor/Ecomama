import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
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
  const [location, setLocation] = useState(initialData?.location || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        location: location.trim() || null,
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación (opcional)
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lugar donde se realizará el evento"
                maxLength={200}
                disabled={isLoading}
              />
            </div>
          </>
        )}

        {errors.submit && (
          <p className="text-sm text-red-600">{errors.submit}</p>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Publicar"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
