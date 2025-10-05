"use client";

import { useState, useEffect } from "react";
import { fetchWithError } from "@/lib/utils/fetch-helpers";
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
      const data = await fetchWithError<UserEventWithDetails[]>("/api/users/me/events");
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
