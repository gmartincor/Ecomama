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
    <Card variant="elevated" className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{typeIcon}</span>
            <Badge variant={typeVariant}>{typeLabel}</Badge>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
          <p className="text-muted-foreground whitespace-pre-wrap mb-4">{listing.description}</p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Publicado por {listing.author.name}</span>
            <span>•</span>
            <span>{createdDate}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex flex-col gap-2">
            {isAuthor ? (
              <>
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(listing.id)}>
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(listing.id)}
                  >
                    Eliminar
                  </Button>
                )}
              </>
            ) : (
              onContactAuthor && (
                <Button size="sm" variant="primary" onClick={() => onContactAuthor(listing.author.id)}>
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
