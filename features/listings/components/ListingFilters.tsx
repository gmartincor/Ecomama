import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ListingStatus } from "../types";

type ListingFiltersProps = {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: ListingStatus | undefined) => void;
  onClearFilters: () => void;
};

export const ListingFilters = ({
  onSearchChange,
  onStatusChange,
  onClearFilters,
}: ListingFiltersProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ListingStatus | undefined>(undefined);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const handleStatusChange = (value: ListingStatus | undefined) => {
    setStatus(value);
    onStatusChange(value);
  };

  const handleClear = () => {
    setSearch("");
    setStatus(undefined);
    onClearFilters();
  };

  const hasActiveFilters = search || status;

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
      <div className="flex-1">
        <Input
          type="search"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="text-sm"
        />
      </div>

      <select
        value={status || ""}
        onChange={(e) => handleStatusChange(e.target.value as ListingStatus || undefined)}
        className="px-3 py-2 border border-input bg-card text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-shadow text-sm w-full sm:w-auto"
      >
        <option value="">Todos los estados</option>
        <option value="ACTIVE">Activos</option>
        <option value="INACTIVE">Inactivos</option>
        <option value="EXPIRED">Expirados</option>
      </select>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={handleClear} className="w-full sm:w-auto text-sm">
          Limpiar
        </Button>
      )}
    </div>
  );
};
