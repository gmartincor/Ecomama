"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CommunitySwitcher } from "@/features/communities/components/CommunitySwitcher";
import { navVariants } from "@/lib/design";

export function Header() {
  const { user, isAuthenticated, isSuperAdmin } = useAuth();

  if (!isAuthenticated || isSuperAdmin) return null;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className={navVariants.sticky}>
      <div className="container mx-auto flex h-16 items-center justify-between px-2 sm:px-4 gap-2">
        <Link href="/dashboard" className="flex-shrink-0">
          <h1 className="text-lg sm:text-2xl font-bold text-primary cursor-pointer hover:opacity-80">
            🌱 <span className="hidden xs:inline">Ecomama</span>
          </h1>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <div className="hidden sm:block">
            <CommunitySwitcher />
          </div>
          
          <Link href="/profile/me" className="flex-shrink-0">
            <div className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:opacity-80">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary text-xs sm:text-sm font-medium text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </div>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Salir</span>
            <span className="sm:hidden">🚪</span>
          </Button>
        </div>
      </div>
      
      <div className="sm:hidden border-t border-border">
        <div className="container mx-auto px-2 py-2">
          <CommunitySwitcher />
        </div>
      </div>
    </header>
  );
}
