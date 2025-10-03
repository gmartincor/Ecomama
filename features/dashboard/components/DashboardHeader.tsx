import type { CommunityWithRelations } from "@/features/communities/types";

type DashboardHeaderProps = {
  community: CommunityWithRelations;
};

export const DashboardHeader = ({ community }: DashboardHeaderProps) => {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 break-words">{community.name}</h1>
      <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-none">{community.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
        <span className="flex items-center gap-1">📍 <span className="truncate max-w-[200px] sm:max-w-none">{community.city}, {community.country}</span></span>
        <span className="hidden sm:inline">•</span>
        <span className="flex items-center gap-1">👤 <span className="truncate max-w-[150px] sm:max-w-none">Admin: {community.admin.name}</span></span>
      </div>
    </div>
  );
};
