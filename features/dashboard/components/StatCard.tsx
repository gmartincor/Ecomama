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
      className={`p-6 ${onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        {icon && <span className="text-4xl">{icon}</span>}
      </div>
    </Card>
  );
};
