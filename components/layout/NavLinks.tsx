"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS } from "./constants";

export const NavLinks = () => {
  const router = useRouter();

  return (
    <div className="hidden sm:flex items-center gap-2">
      {NAV_LINKS.map(({ href, label, icon }) => (
        <Button
          key={href}
          variant="ghost"
          size="sm"
          onClick={() => router.push(href)}
          className="text-sm"
        >
          {icon} {label}
        </Button>
      ))}
    </div>
  );
};
