"use client";

import { useState, useEffect } from "react";
import type { UserEventWithDetails } from "../types";

type UseUserEventsResult = {
  events: UserEventWithDetails[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export const useUserEvents = (): UseUserEventsResult => {
  const [events, setEvents] = useState<UserEventWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/me/events");

      if (!response.ok) {
        throw new Error("Error al cargar tus eventos");
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
  };
};
