import { ReactNode } from "react";

export type ColumnAlignment = "left" | "center" | "right";

export interface Column<T> {
  key: string;
  label: string;
  align?: ColumnAlignment;
  sortable?: boolean;
  render: (item: T) => ReactNode;
  mobileRender?: (item: T) => ReactNode;
  className?: string;
}

export interface Action<T> {
  label: string;
  variant?: "default" | "primary" | "destructive" | "outline";
  onClick: (item: T) => void | Promise<void>;
  disabled?: (item: T) => boolean;
  confirm?: {
    message: (item: T) => string;
  };
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[] | ((item: T) => Action<T>[]);
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
  isProcessing?: (item: T) => boolean;
  getItemKey: (item: T) => string;
  mobileCard?: (item: T) => ReactNode;
}
