import { getGlobalStats } from "@/lib/services/global-stats-service";
import { createGetHandler } from "@/lib/api";

export const GET = createGetHandler(async () => {
  return await getGlobalStats();
});
