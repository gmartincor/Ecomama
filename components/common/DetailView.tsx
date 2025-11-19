import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type DetailViewProps = {
  title: string;
  description: string;
  icon: ReactNode;
  badges?: ReactNode[];
  metadata: {
    icon: string;
    label: string;
    value: string;
  }[];
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
  authorSection: ReactNode;
  additionalActions?: ReactNode;
};

export const DetailView = ({
  title,
  description,
  icon,
  badges = [],
  metadata,
  onBack,
  onEdit,
  onDelete,
  isOwner = false,
  authorSection,
  additionalActions,
}: DetailViewProps) => {
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
            {icon}
            {badges.map((badge, idx) => (
              <div key={idx}>{badge}</div>
            ))}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-foreground whitespace-pre-wrap leading-relaxed">
              {description}
            </p>
          </div>

          {metadata.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              {metadata.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {additionalActions}

          {isOwner && (onEdit || onDelete) && (
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

      {authorSection}
    </div>
  );
};
