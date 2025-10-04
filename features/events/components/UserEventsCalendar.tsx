"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { UserEventWithDetails } from "../types";

type UserEventsCalendarProps = {
  events: UserEventWithDetails[];
};

type GroupedEvents = {
  date: string;
  events: UserEventWithDetails[];
};

export const UserEventsCalendar = ({ events }: UserEventsCalendarProps) => {
  const groupedEvents = useMemo(() => {
    const eventsWithDates = events.filter(e => e.eventDate);
    
    const grouped = eventsWithDates.reduce((acc, event) => {
      const dateKey = new Date(event.eventDate!).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, UserEventWithDetails[]>);

    return Object.entries(grouped)
      .map(([date, events]) => ({ date, events }))
      .sort((a, b) => {
        const dateA = new Date(a.events[0].eventDate!);
        const dateB = new Date(b.events[0].eventDate!);
        return dateA.getTime() - dateB.getTime();
      });
  }, [events]);

  if (groupedEvents.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-4xl mb-4">📅</div>
        <p className="text-muted-foreground">No tienes eventos programados</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {groupedEvents.map((group, idx) => (
        <Card key={idx} className="p-4 sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold capitalize flex items-center gap-2">
              <span>📅</span>
              {group.date}
            </h3>
            <Badge variant="muted" className="mt-2 text-xs">
              {group.events.length} {group.events.length === 1 ? "evento" : "eventos"}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {group.events.map((event) => {
              const eventTime = new Date(event.eventDate!).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 bg-background/50 rounded-lg border border-border/50"
                >
                  <div className="flex-shrink-0 text-sm font-medium text-primary min-w-[60px]">
                    {eventTime}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base break-words mb-1">
                      {event.title}
                    </h4>
                    
                    {event.location && (
                      <p className="text-xs text-muted-foreground flex items-start gap-1 mb-1">
                        <span>📍</span>
                        <span className="break-words">{event.location}</span>
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground flex items-start gap-1">
                      <span>🏘️</span>
                      <span className="break-words">{event.community.name}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
};
