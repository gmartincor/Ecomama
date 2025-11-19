import type { ListingStatus, ListingType } from "../types";

export const LISTING_TYPE_CONFIG: Record<
  ListingType,
  { icon: string; label: string; variant: "success" | "info" }
> = {
  OFFER: { icon: "🌾", label: "Oferta", variant: "success" },
  DEMAND: { icon: "🛒", label: "Demanda", variant: "info" },
};

export const LISTING_STATUS_CONFIG: Record<
  ListingStatus,
  { icon: string; label: string; variant: "success" | "muted" | "destructive" }
> = {
  ACTIVE: { icon: "✅", label: "Activo", variant: "success" },
  INACTIVE: { icon: "⏸️", label: "Inactivo", variant: "muted" },
  EXPIRED: { icon: "⏱️", label: "Expirado", variant: "destructive" },
};

export const STATUS_OPTIONS: Array<{
  value: ListingStatus;
  label: string;
  icon: string;
}> = [
  { value: "ACTIVE", label: "Activo", icon: "✅" },
  { value: "INACTIVE", label: "Inactivo", icon: "⏸️" },
  { value: "EXPIRED", label: "Expirado", icon: "⏱️" },
];
