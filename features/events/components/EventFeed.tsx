import { EventCard } from "./EventCard";
import { EmptyState } from "@/components/common";
import type { EventWithAuthor } from "../types";

type EventFeedProps = {
  events: EventWithAuthor[];
  isLoading?: boolean;
  isAdmin?: boolean;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onTogglePin?: (eventId: string, isPinned: boolean) => void;
  onRegister?: (eventId: string) => void;
  onCancelRegistration?: (eventId: string) => void;
  registeredEventIds?: Set<string>;
  isRegistering?: boolean;
  attendeesCounts?: Map<string, number>;
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
  onRegister,
  onCancelRegistration,
  registeredEventIds,
  isRegistering = false,
  attendeesCounts,
  emptyMessage = "No hay publicaciones aún",
  emptyActionLabel,
  onEmptyAction,
}: EventFeedProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-lg" />
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
        description="Las publicaciones de eventos y noticias aparecerán aquí"
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
          onRegister={onRegister}
          onCancelRegistration={onCancelRegistration}
          isRegistered={registeredEventIds?.has(event.id)}
          isRegistering={isRegistering}
          attendeesCount={attendeesCounts?.get(event.id)}
        />
      ))}
    </div>
  );
};
