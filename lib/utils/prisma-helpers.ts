import { Prisma } from '@prisma/client';

type AuthorInclude = {
  author: {
    select: {
      id: true;
      name: true;
      email: true;
    };
  };
};

export const authorSelect = {
  id: true,
  name: true,
  email: true,
} as const;

export const withAuthor = (): AuthorInclude => ({
  author: {
    select: authorSelect,
  },
});

export const buildWhereClause = <T extends Record<string, unknown>>(
  filters: Partial<T>
): Partial<T> => {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

export const buildSearchClause = (fields: string[], searchTerm: string) => {
  return fields.map((field) => ({
    [field]: { contains: searchTerm, mode: 'insensitive' as Prisma.QueryMode },
  }));
};
