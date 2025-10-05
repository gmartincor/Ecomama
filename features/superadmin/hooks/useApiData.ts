import { useApi } from "@/lib/hooks";

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

export function useApiData<T, U = void>(
  options: UseApiDataOptions<T, U>
): UseApiDataReturn<T, U> {
  return useApi<T, U>(options);
}
