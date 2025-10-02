export type CommunityStats = {
  membersCount: number;
  activeListingsCount: number;
  eventsCount: number;
};

export type DashboardTab = "feed" | "members" | "offers" | "demands";

export type TabConfig = {
  id: DashboardTab;
  label: string;
  href: string;
  icon?: string;
};
