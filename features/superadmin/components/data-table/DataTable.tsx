"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { DataTableProps, Column, Action } from "./types";

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  searchable = false,
  searchPlaceholder = "Buscar...",
  searchKeys = [],
  emptyMessage = "No se encontraron resultados",
  isProcessing,
  getItemKey,
  mobileCard,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    if (!searchable || !search || searchKeys.length === 0) return data;

    const searchLower = search.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        return value?.toString().toLowerCase().includes(searchLower);
      })
    );
  }, [data, search, searchable, searchKeys]);

  const handleAction = async (action: any, item: T) => {
    if (action.confirm) {
      const confirmed = confirm(action.confirm.message(item));
      if (!confirmed) return;
    }

    const itemKey = getItemKey(item);
    setProcessingId(itemKey);
    try {
      await action.onClick(item);
    } finally {
      setProcessingId(null);
    }
  };

  const getAlignmentClass = (align: string = "left") => {
    const alignmentMap = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };
    return alignmentMap[align as keyof typeof alignmentMap] || "text-left";
  };

  const processing = (item: T) => {
    const itemKey = getItemKey(item);
    return processingId === itemKey || isProcessing?.(item) || false;
  };

  const getItemActions = (item: T): Action<T>[] => {
    if (!actions) return [];
    return typeof actions === "function" ? actions(item) : actions;
  };

  return (
    <Card className="p-4 sm:p-6">
      {searchable && (
        <div className="mb-6">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {filteredData.length} de {data.length} resultados
          </p>
        </div>
      )}

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${getAlignmentClass(
                    column.align
                  )} ${column.className || ""}`}
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredData.map((item) => {
              const itemKey = getItemKey(item);
              const itemProcessing = processing(item);
              const itemActions = getItemActions(item);

              return (
                <tr
                  key={itemKey}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-4 ${getAlignmentClass(
                        column.align
                      )} ${column.className || ""}`}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                  {itemActions.length > 0 && (
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex gap-2 justify-end">
                        {itemActions.map((action, idx) => (
                          <Button
                            key={idx}
                            variant={action.variant || "outline"}
                            size="sm"
                            onClick={() => handleAction(action, item)}
                            disabled={
                              itemProcessing || action.disabled?.(item)
                            }
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {filteredData.map((item) => {
          const itemKey = getItemKey(item);
          const itemActions = getItemActions(item);
          return (
            <Card key={itemKey} className="p-4">
              {mobileCard ? (
                mobileCard(item)
              ) : (
                <div className="space-y-2">
                  {columns.map((column) => (
                    <div key={column.key}>
                      <p className="text-xs text-muted-foreground">
                        {column.label}
                      </p>
                      <div>
                        {column.mobileRender
                          ? column.mobileRender(item)
                          : column.render(item)}
                      </div>
                    </div>
                  ))}
                  {itemActions.length > 0 && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-border">
                      {itemActions.map((action, idx) => (
                        <Button
                          key={idx}
                          variant={action.variant || "outline"}
                          size="sm"
                          onClick={() => handleAction(action, item)}
                          disabled={
                            processing(item) || action.disabled?.(item)
                          }
                          className="w-full"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {emptyMessage}
        </div>
      )}
    </Card>
  );
}
