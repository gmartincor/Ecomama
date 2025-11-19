"use client";

import { Logo } from "./Logo";
import { UserAvatar } from "./UserAvatar";
import { LogoutButton } from "./LogoutButton";
import { NavLinks } from "./NavLinks";
import { MobileNav } from "./MobileNav";
import { InstallPWAButton } from "@/features/pwa";
import type { HeaderUser } from "./types";

type HeaderContentProps = {
  user: HeaderUser;
  onLogout: () => void;
  isLoggingOut?: boolean;
};

export const HeaderContent = ({ user, onLogout, isLoggingOut }: HeaderContentProps) => {
  return (
    <nav className="flex items-center justify-between h-full px-4" aria-label="Main navigation">
      <div className="flex items-center gap-3">
        <Logo />
        <MobileNav />
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <NavLinks />
        <InstallPWAButton />
        <UserAvatar user={user} size="md" />
        <LogoutButton onLogout={onLogout} isLoading={isLoggingOut} />
      </div>
    </nav>
  );
};
