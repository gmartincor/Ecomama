"use client";

import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { UserAvatar } from "./UserAvatar";
import { LogoutButton } from "./LogoutButton";
import { Button } from "@/components/ui/Button";
import { CommunitySwitcher } from "@/features/communities/components/CommunitySwitcher";
import { useIsAdminOfActiveCommunity } from "@/features/communities/hooks/useIsAdminOfActiveCommunity";
import type { HeaderUser } from "./types";

type HeaderContentProps = {
  user: HeaderUser;
  onLogout: () => void;
};

export const HeaderContent = ({ user, onLogout }: HeaderContentProps) => {
  const router = useRouter();
  const { isAdmin, communityId } = useIsAdminOfActiveCommunity();

  return (
    <>
      <nav className="flex items-center justify-between h-16 px-4" aria-label="Main navigation">
        <Logo />
        
        <div className="flex items-center gap-3">
          <div className="hidden md:block min-w-[200px] max-w-[300px]">
            <CommunitySwitcher />
          </div>

          {isAdmin && communityId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/community/${communityId}/dashboard`)}
              className="hidden lg:flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>⚙️</span>
              <span className="hidden xl:inline">Panel Admin</span>
            </Button>
          )}
          
          <UserAvatar user={user} size="md" />
          
          <LogoutButton onLogout={onLogout} />
        </div>
      </nav>

      <div className="md:hidden px-4 py-2.5 flex flex-col gap-2">
        <CommunitySwitcher />
        
        {isAdmin && communityId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/community/${communityId}/dashboard`)}
            className="w-full text-xs"
          >
            ⚙️ Panel Admin
          </Button>
        )}
      </div>
    </>
  );
};
