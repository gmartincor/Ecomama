"use client";

import { Badge } from "@/components/ui/Badge";
import { CalendarIcon } from "@/components/ui/CalendarIcon";
import { DetailView } from "@/components/common/DetailView";
import { AuthorCard } from "@/components/common/AuthorCard";
import { EVENT_TYPE_OPTIONS } from "./EventTypeSelector";
import type { EventWithAuthor } from "../types";

type EventDetailViewProps = {
  event: EventWithAuthor;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewAuthorProfile?: () => void;
  isAuthor?: boolean;
  attendeesCount?: number;
};

export const EventDetailView = ({
  event,
  onBack,
  onEdit,
  onDelete,
  onViewAuthorProfile,
  isAuthor = false,
  attendeesCount,
}: EventDetailViewProps) => {
  const typeOption = EVENT_TYPE_OPTIONS.find((opt) => opt.value === event.type);
  const hasEventDate = event.type === "EVENT" && !!event.eventDate;

  const createdDate = new Date(event.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const metadata = [];

  if (hasEventDate && event.eventDate) {
    const formattedDate = new Date(event.eventDate).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    metadata.push({
      icon: "🗓️",
      label: "FECHA Y HORA",
      value: formattedDate,
    });
  }

  if (event.location) {
    metadata.push({
      icon: "📍",
      label: "UBICACIÓN",
      value: event.location,
    });
  }

  if (isAuthor && event.type === "EVENT" && attendeesCount !== undefined) {
    metadata.push({
      icon: "👥",
      label: "PERSONAS INSCRITAS",
      value: `${attendeesCount} ${attendeesCount === 1 ? 'persona' : 'personas'}`,
    });
  }

  metadata.push({
    icon: "📅",
    label: "FECHA DE PUBLICACIÓN",
    value: createdDate,
  });

  const icon = hasEventDate && event.eventDate ? (
    <CalendarIcon date={event.eventDate} size="lg" />
  ) : (
    <span className="text-3xl">{typeOption?.icon}</span>
  );

  const badges = [
    <Badge key="type" variant="primary">
      {typeOption?.label}
    </Badge>,
  ];

  if (event.isPinned) {
    badges.push(
      <Badge key="pinned" variant="warning">
        📌 Fijado
      </Badge>
    );
  }

  return (
    <DetailView
      title={event.title}
      description={event.description}
      icon={icon}
      badges={badges}
      metadata={metadata}
      onBack={onBack}
      onEdit={isAuthor ? onEdit : undefined}
      onDelete={isAuthor ? onDelete : undefined}
      isOwner={isAuthor}
      authorSection={
        <AuthorCard
          name={event.author.name}
          email={event.author.email}
          isOwner={isAuthor}
          onViewProfile={onViewAuthorProfile}
        />
      }
    />
  );
};
