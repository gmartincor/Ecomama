export const parseQueryParam = (value: string | null): string | undefined => {
  return value || undefined;
};

export const parseNumberParam = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

export const parseBooleanParam = (value: string | null): boolean | undefined => {
  if (!value) return undefined;
  return value.toLowerCase() === 'true';
};

export const parseEnumParam = <T extends string>(
  value: string | null,
  validValues: readonly T[]
): T | undefined => {
  if (!value) return undefined;
  return validValues.includes(value as T) ? (value as T) : undefined;
};
