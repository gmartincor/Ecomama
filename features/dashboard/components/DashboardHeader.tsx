import type { CommunityWithRelations } from "@/features/communities/types";

type DashboardHeaderProps = {
  community: CommunityWithRelations;
};

export const DashboardHeader = ({ community }: DashboardHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
      <p className="text-muted-foreground">{community.description}</p>
      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
        <span>📍 {community.city}, {community.country}</span>
        <span>•</span>
        <span>👤 Admin: {community.admin.name}</span>
      </div>
    </div>
  );
};
