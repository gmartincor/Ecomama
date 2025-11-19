"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { LISTING_TYPE_CONFIG, LISTING_STATUS_CONFIG, STATUS_OPTIONS } from "../config/status-config";
import type { UserListingWithDetails, ListingStatus } from "../types";

type UserListingCardProps = {
  listing: UserListingWithDetails;
  onDelete?: (listingId: string) => void;
  onStatusChange?: (listingId: string, status: ListingStatus) => void;
  isUpdating?: boolean;
};

export const UserListingCard = ({ 
  listing, 
  onDelete, 
  onStatusChange,
  isUpdating = false 
}: UserListingCardProps) => {
  const typeConfig = LISTING_TYPE_CONFIG[listing.type];
  const statusConfig = LISTING_STATUS_CONFIG[listing.status];

  const createdDate = new Date(listing.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ListingStatus;
    if (onStatusChange && newStatus !== listing.status) {
      onStatusChange(listing.id, newStatus);
    }
  };

  return (
    <Card variant="elevated" className="p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xl sm:text-2xl">{typeConfig.icon}</span>
              <Badge variant={typeConfig.variant} className="text-xs">{typeConfig.label}</Badge>
              <Badge variant={statusConfig.variant} className="text-xs flex items-center gap-1">
                <span>{statusConfig.icon}</span>
                <span>{statusConfig.label}</span>
              </Badge>
            </div>

            <h3 className="text-lg sm:text-xl font-bold mb-2 break-words">{listing.title}</h3>

            <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap break-words mb-4">
              {listing.description}
            </p>

            {listing.city && listing.country && (
              <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
                <span>📍</span>
                <span className="break-words">{listing.city}, {listing.country}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-4 pt-4 border-t">
              <span>Publicado el {createdDate}</span>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 justify-end sm:justify-start flex-shrink-0">
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(listing.id)}
                className="text-xs sm:text-sm"
                disabled={isUpdating}
              >
                Eliminar
              </Button>
            )}
          </div>
        </div>

        {onStatusChange && (
          <div className="flex items-center gap-3 pt-2 border-t">
            <label className="text-sm font-medium text-foreground flex-shrink-0">
              Estado:
            </label>
            <Select
              value={listing.status}
              onChange={handleStatusChange}
              disabled={isUpdating}
              className="max-w-[200px] text-sm"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>
    </Card>
  );
};
