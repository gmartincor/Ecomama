import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState = ({
  icon = "📭",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <Card className="p-12">
      <div className="text-center space-y-4">
        <div className="text-6xl">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground max-w-md mx-auto">{description}</p>
        {actionLabel && onAction && (
          <div className="pt-4">
            <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
          </div>
        )}
      </div>
    </Card>
  );
};
