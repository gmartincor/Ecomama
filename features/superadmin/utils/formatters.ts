export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatShortDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });
};
