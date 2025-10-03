import { getCommunityStats as getStats } from "@/lib/services/stats-service";
import type { CommunityStats } from "../types";

export const getCommunityStats = async (communityId: string): Promise<CommunityStats> => {
  return await getStats(communityId);
};
