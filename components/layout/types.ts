export type HeaderUser = {
  name: string;
  email: string;
};

export const mapToHeaderUser = (user: { name?: string | null; email?: string | null }): HeaderUser | null => {
  if (!user.name || !user.email) return null;
  return {
    name: user.name,
    email: user.email,
  };
};
