import { EventCard } from "./EventCard";
import { EmptyState } from "@/features/dashboard/components";
import type { Event } from "../types";

type EventFeedProps = {
  events: Event[];
  isLoading?: boolean;
  isAdmin?: boolean;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onTogglePin?: (eventId: string, isPinned: boolean) => void;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
};

export const EventFeed = ({
  events,
  isLoading = false,
  isAdmin = false,
  onEdit,
  onDelete,
  onTogglePin,
  emptyMessage = "No hay publicaciones aún",
  emptyActionLabel,
  onEmptyAction,
}: EventFeedProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title={emptyMessage}
        description="Las publicaciones de eventos y anuncios aparecerán aquí"
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  );
};
