import { Card } from "@/components/ui/Card";

interface MetricCardProps {
  label: string;
  value: number;
  icon: string;
  activeCount?: number;
  activeLabel?: string;
  inactiveCount?: number;
  inactiveLabel?: string;
  onClick?: () => void;
}

export function MetricCard({
  label,
  value,
  icon,
  activeCount,
  activeLabel = "activos",
  inactiveCount,
  inactiveLabel = "inactivas",
  onClick,
}: MetricCardProps) {
  const hasActiveInfo = activeCount !== undefined;
  const hasInactiveInfo = inactiveCount !== undefined && inactiveCount > 0;

  return (
    <Card
      className={`p-6 ${onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {hasActiveInfo && (
            <p className="text-xs text-success mt-1">
              {activeCount} {activeLabel}
            </p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
      {hasInactiveInfo && (
        <div className="mt-2 text-xs text-warning font-medium">
          ⚠️ {inactiveCount} {inactiveLabel}
        </div>
      )}
    </Card>
  );
}
