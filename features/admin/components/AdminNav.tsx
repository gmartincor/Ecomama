import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/Card";

interface AdminNavProps {
  communityId: string;
}

export function AdminNav({ communityId }: AdminNavProps) {
  const pathname = usePathname();

  const links = [
    {
      href: `/admin/community/${communityId}/dashboard`,
      label: "Dashboard",
      icon: "📊",
    },
    {
      href: `/admin/community/${communityId}/members`,
      label: "Miembros",
      icon: "👥",
    },
    {
      href: `/admin/community/${communityId}/settings`,
      label: "Configuración",
      icon: "⚙️",
    },
  ];

  return (
    <Card className="p-4">
      <nav className="flex flex-col space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </Card>
  );
}
