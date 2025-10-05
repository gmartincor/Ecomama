"use client";

import { signOut } from "next-auth/react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCommunityStore } from "@/lib/stores/useCommunityStore";
import { HeaderContent } from "./HeaderContent";
import { mapToHeaderUser } from "./types";
import { navVariants } from "@/lib/design";

export function Header() {
  const { user, isAuthenticated, isSuperAdmin } = useAuth();
  const { clearCommunityState } = useCommunityStore();

  if (!isAuthenticated || isSuperAdmin || !user) return null;

  const headerUser = mapToHeaderUser(user);
  if (!headerUser) return null;

  const handleLogout = () => {
    clearCommunityState();
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className={navVariants.sticky}>
      <div className="container mx-auto">
        <HeaderContent user={headerUser} onLogout={handleLogout} />
      </div>
    </header>
  );
}
