"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function useAuthRedirect() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return;

    const redirectPath = session.user.role === "SUPERADMIN" ? "/superadmin/dashboard" : "/feed";
    router.push(redirectPath);
  }, [session, status, router]);

  return {
    isReady: status !== "loading",
  };
}
