import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { Listing } from "../types";

type ListingCardProps = {
  listing: Listing;
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
  const typeColor = listing.type === "OFFER" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700";

  const createdDate = new Date(listing.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const statusBadge = {
    ACTIVE: { label: "Activo", color: "bg-green-100 text-green-700" },
    INACTIVE: { label: "Inactivo", color: "bg-gray-100 text-gray-700" },
    EXPIRED: { label: "Expirado", color: "bg-red-100 text-red-700" },
  };

  const status = statusBadge[listing.status];

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{typeIcon}</span>
            <span className={`text-xs font-medium px-2 py-1 rounded ${typeColor}`}>
              {typeLabel}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded ${status.color}`}>
              {status.label}
            </span>
          </div>

          <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
          <p className="text-gray-700 whitespace-pre-wrap mb-4">{listing.description}</p>

          <div className="flex items-center gap-2 text-xs text-gray-500">
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
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(listing.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Eliminar
                  </Button>
                )}
              </>
            ) : (
              onContactAuthor && (
                <Button size="sm" onClick={() => onContactAuthor(listing.author.id)}>
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
