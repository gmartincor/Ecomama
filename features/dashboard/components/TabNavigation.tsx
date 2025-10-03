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
    <div className="border-b border-border overflow-x-auto -mx-2 sm:mx-0">
      <nav className="flex space-x-4 sm:space-x-8 px-2 sm:px-0 min-w-max sm:min-w-0" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`
                whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors flex items-center gap-1 sm:gap-2
                ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {tab.icon && <span className="text-sm sm:text-base">{tab.icon}</span>}
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
