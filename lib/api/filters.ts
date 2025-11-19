import { parseQueryParam, parseNumberParam, parseBooleanParam, parseEnumParam } from '@/lib/utils/query-params';

type FilterConfig<T> = {
  [K in keyof T]?: {
    type: 'string' | 'number' | 'boolean' | 'enum';
    enumValues?: readonly string[];
  };
};

export const parseFilters = <T extends Record<string, unknown>>(
  searchParams: URLSearchParams,
  config: FilterConfig<T>
): Partial<T> => {
  const filters: Partial<T> = {};

  for (const [key, paramConfig] of Object.entries(config)) {
    if (!paramConfig) continue;
    
    const value = searchParams.get(key);
    
    if (!value) continue;

    switch (paramConfig.type) {
      case 'string':
        filters[key as keyof T] = parseQueryParam(value) as T[keyof T];
        break;
      case 'number':
        filters[key as keyof T] = parseNumberParam(value) as T[keyof T];
        break;
      case 'boolean':
        filters[key as keyof T] = parseBooleanParam(value) as T[keyof T];
        break;
      case 'enum':
        if (paramConfig.enumValues) {
          filters[key as keyof T] = parseEnumParam(value, paramConfig.enumValues) as T[keyof T];
        }
        break;
    }
  }

  return filters;
};

export const extractRequiredParam = (
  searchParams: URLSearchParams,
  paramName: string,
  errorMessage?: string
): string => {
  const value = searchParams.get(paramName);
  
  if (!value) {
    throw {
      message: errorMessage || `${paramName} is required`,
      statusCode: 400,
    };
  }

  return value;
};

export const extractOptionalParam = (
  searchParams: URLSearchParams,
  paramName: string
): string | undefined => {
  return parseQueryParam(searchParams.get(paramName));
};
