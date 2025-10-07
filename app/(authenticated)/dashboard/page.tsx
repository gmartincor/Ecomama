"use client";

import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function DashboardPage() {
  const { isReady } = useAuthRedirect();

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return null;
}
