export type WithAuthor<T> = T & {
  author: {
    id: string;
    name: string;
    email: string;
  };
};

export type WithCounts<T, K extends string = string> = T & {
  _count: Record<K, number>;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type SelectFields<T> = {
  [K in keyof T]?: boolean;
};

export type UpdateData<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;
