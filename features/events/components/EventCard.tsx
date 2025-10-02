import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Event } from "../types";
import { EVENT_TYPE_OPTIONS } from "./EventTypeSelector";

type EventCardProps = {
  event: Event;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onTogglePin?: (eventId: string, isPinned: boolean) => void;
  isAdmin?: boolean;
};

export const EventCard = ({
  event,
  onEdit,
  onDelete,
  onTogglePin,
  isAdmin = false,
}: EventCardProps) => {
  const typeOption = EVENT_TYPE_OPTIONS.find((opt) => opt.value === event.type);
  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const createdDate = new Date(event.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className={`p-6 ${event.isPinned ? "border-2 border-primary" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{typeOption?.icon}</span>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
              {typeOption?.label}
            </span>
            {event.isPinned && (
              <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded">
                📌 Fijado
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold mb-2">{event.title}</h3>

          <p className="text-gray-700 whitespace-pre-wrap mb-4">{event.description}</p>

          {formattedDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span>📅</span>
              <span className="capitalize">{formattedDate}</span>
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span>📍</span>
              <span>{event.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
            <span>Publicado por {event.author.name}</span>
            <span>•</span>
            <span>{createdDate}</span>
          </div>
        </div>

        {isAdmin && (
          <div className="flex flex-col gap-2">
            {onTogglePin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTogglePin(event.id, !event.isPinned)}
              >
                {event.isPinned ? "Desfijar" : "Fijar"}
              </Button>
            )}
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(event.id)}>
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(event.id)}
                className="text-red-600 hover:text-red-700"
              >
                Eliminar
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
