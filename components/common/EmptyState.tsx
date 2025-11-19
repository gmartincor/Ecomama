"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type EmptyStateProps = {
  icon: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <Card className="p-8 sm:p-12 text-center">
      <div className="text-5xl sm:text-6xl mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};
