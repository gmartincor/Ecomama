import { useApi } from "./useApi";

interface UseFetchOptions<T> {
  endpoint: string;
  autoFetch?: boolean;
  transformResponse?: (data: unknown) => T;
  getErrorMessage?: (status: number) => string;
}

interface UseFetchReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFetch<T>(options: UseFetchOptions<T>): UseFetchReturn<T> {
  const { data, isLoading, error, refetch } = useApi<T>(options);
  return { data, isLoading, error, refetch };
}
