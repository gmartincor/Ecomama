"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { CommunityWithRelations } from "@/features/communities/types";

type DashboardHeaderProps = {
  community: CommunityWithRelations;
};

export const DashboardHeader = ({ community }: DashboardHeaderProps) => {
  const router = useRouter();

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 break-words">{community.name}</h1>
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-none">{community.description}</p>
        </div>
        
        <div className="flex shrink-0">
          <Button
            variant="outline"
            onClick={() => router.push("/communities/map")}
            className="w-full sm:w-auto text-sm whitespace-nowrap"
          >
            🌍 Explorar Comunidades
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
        <span className="flex items-center gap-1">📍 <span className="truncate max-w-[200px] sm:max-w-none">{community.city}, {community.country}</span></span>
        <span className="hidden sm:inline">•</span>
        <span className="flex items-center gap-1">👤 <span className="truncate max-w-[150px] sm:max-w-none">Admin: {community.admin.name}</span></span>
      </div>
    </div>
  );
};
