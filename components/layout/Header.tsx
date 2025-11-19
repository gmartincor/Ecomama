"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks";
import { HeaderContent } from "./HeaderContent";
import { mapToHeaderUser } from "./types";
import { navVariants } from "@/lib/design";

export function Header() {
  const { user, isAuthenticated, isSuperAdmin } = useAuth();
  const { handleLogout, isLoggingOut } = useLogout();

  if (!isAuthenticated || isSuperAdmin || !user) return null;

  const headerUser = mapToHeaderUser(user);
  if (!headerUser) return null;

  return (
    <header className={navVariants.sticky}>
      <div className="container mx-auto h-16">
        <HeaderContent 
          user={headerUser} 
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </div>
    </header>
  );
}
