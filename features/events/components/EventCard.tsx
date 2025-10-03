import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CalendarIcon } from "@/components/ui/CalendarIcon";
import type { EventWithAuthor } from "../types";
import { EVENT_TYPE_OPTIONS } from "./EventTypeSelector";

type EventCardProps = {
  event: EventWithAuthor;
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
  const hasEventDate = event.type === "EVENT" && !!event.eventDate;
  
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
    <Card variant={event.isPinned ? "highlighted" : "elevated"} className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            {hasEventDate && event.eventDate && (
              <CalendarIcon date={event.eventDate} size="md" />
            )}
            {!hasEventDate && <span className="text-xl sm:text-2xl flex-shrink-0">{typeOption?.icon}</span>}
            <Badge variant="primary" className="text-xs">{typeOption?.label}</Badge>
            {event.isPinned && (
              <Badge variant="warning" className="text-xs">📌 Fijado</Badge>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold mb-2 break-words">{event.title}</h3>

          <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap break-words mb-4">{event.description}</p>

          {formattedDate && (
            <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
              <span className="capitalize font-medium break-words">{formattedDate}</span>
            </div>
          )}

          {event.location && (
            <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
              <span className="flex-shrink-0">📍</span>
              <span className="break-words">{event.location}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-4">
            <span className="truncate">Publicado por {event.author.name}</span>
            <span className="hidden sm:inline">•</span>
            <span className="whitespace-nowrap">{createdDate}</span>
          </div>
        </div>

        {isAdmin && (
          <div className="flex sm:flex-col gap-2 justify-end sm:justify-start flex-shrink-0">
            {onTogglePin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTogglePin(event.id, !event.isPinned)}
                className="text-xs sm:text-sm"
              >
                {event.isPinned ? "Desfijar" : "Fijar"}
              </Button>
            )}
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(event.id)}
                className="text-xs sm:text-sm"
              >
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(event.id)}
                className="text-xs sm:text-sm"
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
