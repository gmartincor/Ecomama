"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS } from "./constants";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <div className="sm:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-xl p-2"
        aria-label="Menu"
      >
        {isOpen ? "✕" : "☰"}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-white border-b shadow-lg z-50 animate-in slide-in-from-top">
            <nav className="flex flex-col p-2">
              {NAV_LINKS.map(({ href, label, icon }) => (
                <Button
                  key={href}
                  variant="ghost"
                  size="lg"
                  onClick={() => handleNavigate(href)}
                  className="justify-start text-left gap-3 py-4"
                >
                  <span className="text-xl">{icon}</span>
                  <span className="text-base">{label}</span>
                </Button>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
};
