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
      className="p-6"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        {icon && <span className="text-4xl">{icon}</span>}
      </div>
    </Card>
  );
};
