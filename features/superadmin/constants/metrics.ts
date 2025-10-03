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
    key: "totalCommunities",
    label: "Total Comunidades",
    icon: "🏘️",
    activeKey: "activeCommunities",
    activeLabel: "activas",
    inactiveKey: "inactiveCommunities",
    inactiveLabel: "inactivas",
    href: "/superadmin/communities",
  },
  {
    key: "totalListings",
    label: "Total Publicaciones",
    icon: "📦",
  },
  {
    key: "totalEvents",
    label: "Total Eventos",
    icon: "📅",
  },
];
