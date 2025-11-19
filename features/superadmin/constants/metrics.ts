export type MetricConfig = {
  key: string;
  label: string;
  icon: string;
  activeKey?: string;
  activeLabel?: string;
  inactiveKey?: string;
  inactiveLabel?: string;
  href?: string;
};

export const METRICS_CONFIG: MetricConfig[] = [
  {
    key: "totalUsers",
    label: "Total Usuarios",
    icon: "👥",
    activeKey: "activeUsers",
    activeLabel: "activos",
    href: "/superadmin/users",
  },
  {
    key: "totalListings",
    label: "Total Anuncios",
    icon: "📦",
  },
  {
    key: "totalEvents",
    label: "Total Eventos",
    icon: "📅",
  },
];
