import { useCallback } from "react";
import { useApiData } from "./useApiData";
import type { GlobalStats } from "../types";

export const useStats = () => {
  return useApiData<GlobalStats>({
    endpoint: "/api/superadmin/stats",
  });
};
