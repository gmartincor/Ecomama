import { useState, useEffect, useCallback } from "react";

interface UseApiDataOptions<T, U = void> {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  autoFetch?: boolean;
  transformResponse?: (data: any) => T;
}

interface UseApiDataReturn<T, U = void> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (body?: U) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useApiData<T, U = void>({
  endpoint,
  method = "GET",
  autoFetch = true,
  transformResponse,
}: UseApiDataOptions<T, U>): UseApiDataReturn<T, U> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (body?: U) => {
      setIsLoading(true);
      setError(null);

      try {
        const options: RequestInit = {
          method,
          headers: body ? { "Content-Type": "application/json" } : undefined,
          body: body ? JSON.stringify(body) : undefined,
        };

        const response = await fetch(endpoint, options);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const responseData = await response.json();
        const finalData = transformResponse
          ? transformResponse(responseData)
          : responseData;
        
        setData(finalData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, method, transformResponse]
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
