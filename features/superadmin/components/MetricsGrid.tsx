import { useRouter } from "next/navigation";
import { MetricCard } from "./MetricCard";
import { METRICS_CONFIG } from "../constants/metrics";
import type { GlobalStats } from "../types";

interface MetricsGridProps {
  stats: GlobalStats;
}

export function MetricsGrid({ stats }: MetricsGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {METRICS_CONFIG.map((config) => {
        const value = stats[config.key as keyof GlobalStats] as number;
        const activeCount = config.activeKey
          ? (stats[config.activeKey as keyof GlobalStats] as number)
          : undefined;
        const inactiveCount = config.inactiveKey
          ? (stats[config.inactiveKey as keyof GlobalStats] as number)
          : undefined;

        return (
          <MetricCard
            key={config.key}
            label={config.label}
            value={value}
            icon={config.icon}
            activeCount={activeCount}
            activeLabel={config.activeLabel}
            inactiveCount={inactiveCount}
            inactiveLabel={config.inactiveLabel}
            onClick={config.href ? () => router.push(config.href!) : undefined}
          />
        );
      })}
    </div>
  );
}
