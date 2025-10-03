"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TabConfig } from "../types";

type TabNavigationProps = {
  tabs: TabConfig[];
};

export const TabNavigation = ({ tabs }: TabNavigationProps) => {
  const pathname = usePathname();

  return (
    <div className="border-b border-border">
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }
              `}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
