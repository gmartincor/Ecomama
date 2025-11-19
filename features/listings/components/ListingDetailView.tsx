"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LISTING_TYPE_CONFIG, LISTING_STATUS_CONFIG } from "../config/status-config";
import type { ListingWithAuthor } from "../types";

type ListingDetailViewProps = {
  listing: ListingWithAuthor;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewAuthorProfile?: () => void;
  isAuthor?: boolean;
};

export const ListingDetailView = ({
  listing,
  onBack,
  onEdit,
  onDelete,
  onViewAuthorProfile,
  isAuthor = false,
}: ListingDetailViewProps) => {
  const typeConfig = LISTING_TYPE_CONFIG[listing.type];
  const statusConfig = LISTING_STATUS_CONFIG[listing.status];

  const createdDate = new Date(listing.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← Volver
        </Button>
      )}

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-3xl">{typeConfig.icon}</span>
            <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
            <Badge variant={statusConfig.variant} className="flex items-center gap-1">
              <span>{statusConfig.icon}</span>
              <span>{statusConfig.label}</span>
            </Badge>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
            <p className="text-lg text-foreground whitespace-pre-wrap leading-relaxed">
              {listing.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            {listing.city && listing.country && (
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    UBICACIÓN
                  </p>
                  <p className="text-foreground">
                    {listing.city}, {listing.country}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  FECHA DE PUBLICACIÓN
                </p>
                <p className="text-foreground">{createdDate}</p>
              </div>
            </div>
          </div>

          {isAuthor && (
            <div className="flex gap-3 pt-4 border-t">
              {onEdit && (
                <Button onClick={onEdit} variant="outline">
                  ✏️ Editar
                </Button>
              )}
              {onDelete && (
                <Button onClick={onDelete} variant="destructive">
                  🗑️ Eliminar
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>👤</span>
          Publicado por
        </h2>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xl font-bold">
              {getInitials(listing.author.name)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <button
              onClick={onViewAuthorProfile}
              className="text-lg font-semibold mb-1 hover:text-primary transition-colors cursor-pointer text-left"
            >
              {listing.author.name}
            </button>
            
            <div className="space-y-1 mb-4">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span>✉️</span>
                {listing.author.email}
              </p>
              
              {listing.author.profile?.phone && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>📞</span>
                  {listing.author.profile.phone}
                </p>
              )}
            </div>

            {!isAuthor && onViewAuthorProfile && (
              <Button onClick={onViewAuthorProfile} variant="primary">
                Ver Perfil Completo
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
