import { useApi } from "./useApi";

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

export function useFetch<T>(options: UseFetchOptions<T>): UseFetchReturn<T> {
  const { execute, ...rest } = useApi<T>(options);
  return rest;
}
