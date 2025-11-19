export const extractId = (id: string | string[]): string => {
  return Array.isArray(id) ? id[0] : id;
};
