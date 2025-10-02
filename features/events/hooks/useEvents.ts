"use client";

import { useState, useEffect } from "react";
import type { Event, CreateEventData, UpdateEventData, EventFilters } from "../types";

type UseEventsResult = {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createEvent: (data: CreateEventData) => Promise<void>;
  updateEvent: (eventId: string, data: UpdateEventData) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  togglePinEvent: (eventId: string, isPinned: boolean) => Promise<void>;
};

export const useEvents = (
  communityId: string,
  filters?: EventFilters
): UseEventsResult => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!communityId) {
      setEvents([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append("type", filters.type);
      if (filters?.isPinned !== undefined) params.append("isPinned", String(filters.isPinned));
      if (filters?.authorId) params.append("authorId", filters.authorId);

      const url = `/api/communities/${communityId}/events${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (data: CreateEventData) => {
    const response = await fetch(`/api/communities/${communityId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create event");
    }

    await fetchEvents();
  };

  const updateEvent = async (eventId: string, data: UpdateEventData) => {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update event");
    }

    await fetchEvents();
  };

  const deleteEvent = async (eventId: string) => {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete event");
    }

    await fetchEvents();
  };

  const togglePinEvent = async (eventId: string, isPinned: boolean) => {
    const response = await fetch(`/api/events/${eventId}/pin`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPinned }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to toggle pin");
    }

    await fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, [communityId, JSON.stringify(filters)]);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    togglePinEvent,
  };
};
