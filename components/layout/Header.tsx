"use client";

import { signOut } from "next-auth/react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { HeaderContent } from "./HeaderContent";
import { mapToHeaderUser } from "./types";
import { navVariants } from "@/lib/design";

export function Header() {
  const { user, isAuthenticated, isSuperAdmin } = useAuth();

  if (!isAuthenticated || isSuperAdmin || !user) return null;

  const headerUser = mapToHeaderUser(user);
  if (!headerUser) return null;

  const handleLogout = () => {
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
