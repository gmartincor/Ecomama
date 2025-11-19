"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks";
import { navVariants } from "@/lib/design";
import { UserAvatar } from "./UserAvatar";
import { mapToHeaderUser } from "./types";

export function SuperadminHeader() {
  const { user, isAuthenticated } = useAuth();
  const { handleLogout, isLoggingOut } = useLogout();

  if (!isAuthenticated || !user) return null;

  const headerUser = mapToHeaderUser(user);
  if (!headerUser) return null;

  return (
    <header className={navVariants.sticky}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/superadmin/dashboard">
          <h1 className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80">
            🌱 Ecomama - Superadmin
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <UserAvatar user={headerUser} clickable={false} />
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">Superadministrador</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            isLoading={isLoggingOut}
          >
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
