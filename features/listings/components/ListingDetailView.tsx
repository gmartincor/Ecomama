"use client";

import { Badge } from "@/components/ui/Badge";
import { DetailView } from "@/components/common/DetailView";
import { AuthorCard } from "@/components/common/AuthorCard";
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

  const metadata = [];

  if (listing.city && listing.country) {
    metadata.push({
      icon: "📍",
      label: "UBICACIÓN",
      value: `${listing.city}, ${listing.country}`,
    });
  }

  metadata.push({
    icon: "📅",
    label: "FECHA DE PUBLICACIÓN",
    value: createdDate,
  });

  return (
    <DetailView
      title={listing.title}
      description={listing.description}
      icon={<span className="text-3xl">{typeConfig.icon}</span>}
      badges={[
        <Badge key="type" variant={typeConfig.variant}>{typeConfig.label}</Badge>,
        <Badge key="status" variant={statusConfig.variant} className="flex items-center gap-1">
          <span>{statusConfig.icon}</span>
          <span>{statusConfig.label}</span>
        </Badge>,
      ]}
      metadata={metadata}
      onBack={onBack}
      onEdit={isAuthor ? onEdit : undefined}
      onDelete={isAuthor ? onDelete : undefined}
      isOwner={isAuthor}
      authorSection={
        <AuthorCard
          name={listing.author.name}
          email={listing.author.email}
          phone={listing.author.profile?.phone ?? undefined}
          isOwner={isAuthor}
          onViewProfile={onViewAuthorProfile}
        />
      }
    />
  );
};
