"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { navVariants } from "@/lib/design";

export function SuperadminHeader() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className={navVariants.sticky}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/superadmin/dashboard">
            <h1 className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80">
              🌱 Ecomama - Superadmin
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">Superadministrador</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
