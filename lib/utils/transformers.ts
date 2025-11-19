export const toISOStringOrEmpty = (date: Date | null | undefined): string => {
  return date?.toISOString() || "";
};

export const transformUserSelect = {
  id: true,
  name: true,
  email: true,
} as const;

export const transformToUserSummary = (user: {
  id: string;
  name: string;
  email: string;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});
