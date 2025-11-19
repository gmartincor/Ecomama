"use client";

import { Card } from "@/components/ui/Card";
import { CalendarIcon } from "@/components/ui/CalendarIcon";
import type { UserEventWithDetails } from "../types";
import { EVENT_TYPE_OPTIONS } from "./EventTypeSelector";

type UserEventCardProps = {
  event: UserEventWithDetails;
};

export const UserEventCard = ({ event }: UserEventCardProps) => {
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

  const registeredDate = new Date(event.registeredAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card variant="elevated" className="p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            {hasEventDate && event.eventDate && (
              <CalendarIcon date={event.eventDate} size="md" />
            )}
            {!hasEventDate && <span className="text-xl sm:text-2xl flex-shrink-0">{typeOption?.icon}</span>}
          </div>

          <h3 className="text-lg sm:text-xl font-bold mb-2 break-words">{event.title}</h3>

          <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap break-words mb-4">
            {event.description}
          </p>

          {formattedDate && (
            <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
              <span>🗓️</span>
              <span className="capitalize font-medium break-words">{formattedDate}</span>
            </div>
          )}

          {event.location && (
            <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
              <span>📍</span>
              <span className="break-words">{event.location}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-4 pt-4 border-t">
            <span>Inscrito el {registeredDate}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
