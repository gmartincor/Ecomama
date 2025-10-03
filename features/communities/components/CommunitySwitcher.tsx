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

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <span className="text-sm">
          {activeCommunity ? activeCommunity.name : "Seleccionar comunidad"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-64 shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-border bg-muted">
            <p className="text-xs text-muted-foreground px-2">Mis Comunidades</p>
          </div>
          <div className="py-1 max-h-80 overflow-y-auto">
            {userCommunities.map((community) => (
              <button
                key={community.id}
                onClick={() => handleCommunityChange(community)}
                className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors ${
                  activeCommunity?.id === community.id ? "bg-primary/10 border-l-2 border-primary" : ""
                }`}
              >
                <div className="font-medium text-sm text-foreground">{community.name}</div>
                <div className="text-xs text-muted-foreground">
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
