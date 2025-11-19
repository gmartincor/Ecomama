import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ListingWithAuthor } from "../types";

type ListingCardProps = {
  listing: ListingWithAuthor;
  onEdit?: (listingId: string) => void;
  onDelete?: (listingId: string) => void;
  onContactAuthor?: (authorId: string) => void;
  showActions?: boolean;
  isAuthor?: boolean;
};

export const ListingCard = ({
  listing,
  onEdit,
  onDelete,
  onContactAuthor,
  showActions = true,
  isAuthor = false,
}: ListingCardProps) => {
  const typeIcon = listing.type === "OFFER" ? "🌾" : "🛒";
  const typeLabel = listing.type === "OFFER" ? "Oferta" : "Demanda";
  const typeVariant = listing.type === "OFFER" ? "success" : "info";

  const createdDate = new Date(listing.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const statusConfig = {
    ACTIVE: { label: "Activo", variant: "success" as const },
    INACTIVE: { label: "Inactivo", variant: "muted" as const },
    EXPIRED: { label: "Expirado", variant: "destructive" as const },
  };

  const status = statusConfig[listing.status];

  return (
    <Card variant="elevated" className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xl sm:text-2xl">{typeIcon}</span>
            <Badge variant={typeVariant} className="text-xs">{typeLabel}</Badge>
            <Badge variant={status.variant} className="text-xs">{status.label}</Badge>
          </div>

          <h3 className="text-lg sm:text-xl font-bold mb-2 break-words">{listing.title}</h3>
          <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap break-words mb-4 line-clamp-3">{listing.description}</p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">Publicado por {listing.author.name}</span>
            <span className="hidden sm:inline">•</span>
            <span className="whitespace-nowrap">{createdDate}</span>
            {listing.city && listing.country && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="whitespace-nowrap">📍 {listing.city}, {listing.country}</span>
              </>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex sm:flex-col gap-2 justify-end sm:justify-start flex-shrink-0">
            {isAuthor ? (
              <>
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(listing.id)} className="text-xs sm:text-sm">
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(listing.id)}
                    className="text-xs sm:text-sm"
                  >
                    Eliminar
                  </Button>
                )}
              </>
            ) : (
              onContactAuthor && (
                <Button size="sm" variant="primary" onClick={() => onContactAuthor(listing.author.id)} className="text-xs sm:text-sm">
                  Ver Perfil
                </Button>
              )
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
