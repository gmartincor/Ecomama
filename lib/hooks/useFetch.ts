import { useState, useEffect, useCallback } from "react";

interface UseFetchOptions<T> {
  endpoint: string;
  autoFetch?: boolean;
  transformResponse?: (data: any) => T;
  getErrorMessage?: (status: number) => string;
}

interface UseFetchReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const defaultErrorMessages: Record<number, string> = {
  400: "Solicitud inválida",
  401: "No autorizado",
  403: "No tienes permiso para acceder a este recurso",
  404: "Recurso no encontrado",
  500: "Error interno del servidor",
};

const getDefaultErrorMessage = (status: number): string => {
  return defaultErrorMessages[status] || `Error al cargar los datos (${status})`;
};

export function useFetch<T>({
  endpoint,
  autoFetch = true,
  transformResponse,
  getErrorMessage = getDefaultErrorMessage,
}: UseFetchOptions<T>): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) {
      setError("Endpoint no proporcionado");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(getErrorMessage(response.status));
      }

      const responseData = await response.json();
      const finalData = transformResponse ? transformResponse(responseData) : responseData;
      setData(finalData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, transformResponse, getErrorMessage]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}
