type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

export const fetchWithError = async <T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<T> => {
  const { params, ...fetchOptions } = options || {};

  let fullUrl = url;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl = `${url}?${queryString}`;
    }
  }

  const response = await fetch(fullUrl, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: `Request failed with status ${response.status}`,
    }));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export const fetchJSON = async <T = unknown>(
  url: string,
  data?: unknown,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
): Promise<T> => {
  return fetchWithError<T>(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  });
};
