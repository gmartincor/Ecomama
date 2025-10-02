import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/Card";

export function SuperadminNav() {
  const pathname = usePathname();

  const links = [
    {
      href: "/superadmin/dashboard",
      label: "Dashboard",
      icon: "📊",
    },
    {
      href: "/superadmin/users",
      label: "Usuarios",
      icon: "👥",
    },
    {
      href: "/superadmin/communities",
      label: "Comunidades",
      icon: "🏘️",
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
