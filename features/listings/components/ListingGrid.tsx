import { ListingCard } from "./ListingCard";
import { EmptyState } from "@/components/common";
import type { ListingWithAuthor } from "../types";

type ListingGridProps = {
  listings: ListingWithAuthor[];
  isLoading?: boolean;
  currentUserId?: string;
  onEdit?: (listingId: string) => void;
  onDelete?: (listingId: string) => void;
  onContactAuthor?: (authorId: string) => void;
  onViewDetails?: (listingId: string) => void;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
};

export const ListingGrid = ({
  listings,
  isLoading = false,
  currentUserId,
  onEdit,
  onDelete,
  onContactAuthor,
  onViewDetails,
  emptyMessage,
  emptyActionLabel,
  onEmptyAction,
}: ListingGridProps) => {
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
        icon="�"
        title={emptyMessage || "No hay publicaciones disponibles"}
        description="Las ofertas y demandas de los miembros aparecerán aquí"
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
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
