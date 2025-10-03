import { ListingCard } from "./ListingCard";
import { EmptyState } from "@/features/dashboard/components";
import type { ListingWithAuthor, ListingType } from "../types";

type ListingGridProps = {
  listings: ListingWithAuthor[];
  type: ListingType;
  isLoading?: boolean;
  currentUserId?: string;
  onEdit?: (listingId: string) => void;
  onDelete?: (listingId: string) => void;
  onContactAuthor?: (authorId: string) => void;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
};

export const ListingGrid = ({
  listings,
  type,
  isLoading = false,
  currentUserId,
  onEdit,
  onDelete,
  onContactAuthor,
  emptyMessage,
  emptyActionLabel,
  onEmptyAction,
}: ListingGridProps) => {
  const defaultEmptyMessage = type === "OFFER" 
    ? "No hay ofertas disponibles" 
    : "No hay demandas publicadas";

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-40 sm:h-48 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        icon={type === "OFFER" ? "🌾" : "🛒"}
        title={emptyMessage || defaultEmptyMessage}
        description={`Las ${type === "OFFER" ? "ofertas" : "demandas"} de los miembros aparecerán aquí`}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          isAuthor={listing.authorId === currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          onContactAuthor={onContactAuthor}
        />
      ))}
    </div>
  );
};
