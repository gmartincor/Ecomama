"use client";

import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { UserAvatar } from "./UserAvatar";
import { LogoutButton } from "./LogoutButton";
import { Button } from "@/components/ui/Button";
import type { HeaderUser } from "./types";

type HeaderContentProps = {
  user: HeaderUser;
  onLogout: () => void;
};

export const HeaderContent = ({ user, onLogout }: HeaderContentProps) => {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between h-16 px-4" aria-label="Main navigation">
      <Logo />
      
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/feed")}
            className="text-sm"
          >
            📰 Feed
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/listings")}
            className="text-sm"
          >
            📦 Anuncios
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/map")}
            className="text-sm"
          >
            🗺️ Mapa
          </Button>
        </div>
        
        <UserAvatar user={user} size="md" />
        
        <LogoutButton onLogout={onLogout} />
      </div>
    </nav>
  );
};
