import { useState, useEffect, useCallback, useRef } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface UseApiOptions<TData, TBody = void> {
  endpoint: string;
  method?: HttpMethod;
  autoFetch?: boolean;
  transformResponse?: (data: unknown) => TData;
  getErrorMessage?: (status: number) => string;
}

interface UseApiReturn<TData, TBody = void> {
  data: TData | null;
  isLoading: boolean;
  error: string | null;
  execute: (body?: TBody) => Promise<void>;
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

export function useApi<TData, TBody = void>({
  endpoint,
  method = "GET",
  autoFetch = true,
  transformResponse,
  getErrorMessage = getDefaultErrorMessage,
}: UseApiOptions<TData, TBody>): UseApiReturn<TData, TBody> {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transformRef = useRef(transformResponse);
  const errorMessageRef = useRef(getErrorMessage);

  useEffect(() => {
    transformRef.current = transformResponse;
    errorMessageRef.current = getErrorMessage;
  });

  const execute = useCallback(
    async (body?: TBody) => {
      if (!endpoint) {
        setError("Endpoint no proporcionado");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const options: RequestInit = {
          method,
          headers: body ? { "Content-Type": "application/json" } : undefined,
          body: body ? JSON.stringify(body) : undefined,
          cache: 'no-store',
        };

        const response = await fetch(endpoint, options);

        if (!response.ok) {
          throw new Error(errorMessageRef.current(response.status));
        }

        const responseData = await response.json();
        const finalData = transformRef.current ? transformRef.current(responseData) : responseData;
        setData(finalData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar los datos");
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, method]
  );

  const refetch = useCallback(() => execute(), [execute]);

  useEffect(() => {
    if (autoFetch && method === "GET") {
      execute();
    }
  }, [autoFetch, method, execute]);

  return {
    data,
    isLoading,
    error,
    execute,
    refetch,
  };
}
