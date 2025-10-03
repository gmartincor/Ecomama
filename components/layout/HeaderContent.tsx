import { Logo } from "./Logo";
import { UserAvatar } from "./UserAvatar";
import { LogoutButton } from "./LogoutButton";
import { CommunitySwitcher } from "@/features/communities/components/CommunitySwitcher";
import type { HeaderUser } from "./types";

type HeaderContentProps = {
  user: HeaderUser;
  onLogout: () => void;
};

export const HeaderContent = ({ user, onLogout }: HeaderContentProps) => {
  return (
    <>
      <nav className="flex items-center justify-between h-16 px-4" aria-label="Main navigation">
        <Logo />
        
        <div className="flex items-center gap-3">
          <div className="hidden md:block min-w-[200px] max-w-[300px]">
            <CommunitySwitcher />
          </div>
          
          <UserAvatar user={user} size="md" />
          
          <LogoutButton onLogout={onLogout} />
        </div>
      </nav>

      <div className="md:hidden px-4 py-2.5">
        <CommunitySwitcher />
      </div>
    </>
  );
};
