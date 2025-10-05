"use client";

import { useState, useEffect } from "react";
import { fetchWithError, fetchJSON } from "@/lib/utils/fetch-helpers";
import type { EventWithAuthor, CreateEventData, UpdateEventData, EventFilters } from "../types";

type UseEventsResult = {
  events: EventWithAuthor[];
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
  const [events, setEvents] = useState<EventWithAuthor[]>([]);
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
      const params: Record<string, string | boolean | undefined> = {};
      if (filters?.type) params.type = filters.type;
      if (filters?.isPinned !== undefined) params.isPinned = filters.isPinned;
      if (filters?.authorId) params.authorId = filters.authorId;

      const data = await fetchWithError<EventWithAuthor[]>(
        `/api/communities/${communityId}/events`,
        { params }
      );
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (data: CreateEventData) => {
    await fetchJSON(`/api/communities/${communityId}/events`, data, 'POST');
    await fetchEvents();
  };

  const updateEvent = async (eventId: string, data: UpdateEventData) => {
    await fetchJSON(`/api/events/${eventId}`, data, 'PUT');
    await fetchEvents();
  };

  const deleteEvent = async (eventId: string) => {
    await fetchJSON(`/api/events/${eventId}`, undefined, 'DELETE');
    await fetchEvents();
  };

  const togglePinEvent = async (eventId: string, isPinned: boolean) => {
    await fetchJSON(`/api/events/${eventId}/pin`, { isPinned }, 'PUT');
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
