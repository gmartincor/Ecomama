import { Card } from "@/components/ui/Card";

type StatCardProps = {
  title: string;
  value: number;
  icon?: string;
  onClick?: () => void;
};

export const StatCard = ({ title, value, icon, onClick }: StatCardProps) => {
  return (
    <Card
      variant={onClick ? "interactive" : "default"}
      className="p-4 sm:p-6"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold">{value}</p>
        </div>
        {icon && <span className="text-3xl sm:text-4xl flex-shrink-0">{icon}</span>}
      </div>
    </Card>
  );
};
