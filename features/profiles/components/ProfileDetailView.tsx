"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ProfileWithUser } from "../types";

interface ProfileDetailViewProps {
  profile: ProfileWithUser;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onBack?: () => void;
}

export const ProfileDetailView = ({
  profile,
  isOwnProfile = false,
  onEdit,
  onBack,
}: ProfileDetailViewProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeVariant = (role: string): "primary" | "muted" => {
    return role === "ADMIN" ? "primary" : "muted";
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.user.name}
                className="h-32 w-32 rounded-full object-cover border-4 border-primary/10"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-4xl font-bold border-4 border-primary/10">
                {getInitials(profile.user.name)}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">{profile.user.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <span>✉️</span>
                {profile.user.email}
              </p>
            </div>

            {profile.bio && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                  BIOGRAFÍA
                </h2>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              {profile.phone && (
                <div className="flex items-start gap-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      TELÉFONO
                    </p>
                    <p className="text-foreground">{profile.phone}</p>
                  </div>
                </div>
              )}

              {profile.location && (
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      UBICACIÓN
                    </p>
                    <p className="text-foreground">{profile.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <span className="text-xl">📅</span>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    MIEMBRO DESDE
                  </p>
                  <p className="text-foreground">{formatDate(profile.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">🔄</span>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    ÚLTIMA ACTUALIZACIÓN
                  </p>
                  <p className="text-foreground">{formatDate(profile.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {isOwnProfile && onEdit && (
                <Button onClick={onEdit} variant="primary">
                  ✏️ Editar Perfil
                </Button>
              )}
              {onBack && (
                <Button onClick={onBack} variant="outline">
                  ← Volver
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {profile.communities && profile.communities.length > 0 && (
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🏘️</span>
              Comunidades
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Miembro de {profile.communities.length}{" "}
              {profile.communities.length === 1 ? "comunidad" : "comunidades"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.communities.map((community) => (
              <div
                key={community.id}
                className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-base">{community.name}</h3>
                  <Badge variant={getRoleBadgeVariant(community.role)}>
                    {community.role === "ADMIN" ? "Admin" : "Miembro"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span>📍</span>
                  {community.city}, {community.country}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Desde {formatDate(community.joinedAt)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
