"use client";

import { useState, useRef, useEffect } from "react";
import { useActiveCommunity } from "@/features/communities/hooks/useActiveCommunity";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const CommunitySwitcher = () => {
  const { activeCommunity, userCommunities, setActiveCommunity } = useActiveCommunity();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (userCommunities.length === 0) {
    return null;
  }

  const handleCommunityChange = (community: typeof activeCommunity) => {
    setActiveCommunity(community);
    setIsOpen(false);
  };

  const displayText = activeCommunity?.name || "Seleccionar comunidad";

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 w-full"
      >
        <span className="truncate">{displayText}</span>
        <svg
          className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <Card className="absolute left-0 right-0 md:left-auto md:right-0 md:w-72 mt-2 shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-border bg-muted">
            <p className="text-xs text-muted-foreground px-2">Mis Comunidades</p>
          </div>
          <div className="py-1 max-h-60 md:max-h-80 overflow-y-auto">
            {userCommunities.map((community) => (
              <button
                key={community.id}
                onClick={() => handleCommunityChange(community)}
                className={`w-full text-left px-4 py-2.5 hover:bg-muted transition-colors ${
                  activeCommunity?.id === community.id ? "bg-primary/10 border-l-2 border-primary" : ""
                }`}
              >
                <div className="font-medium text-sm text-foreground truncate">{community.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {community.city}, {community.country}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
