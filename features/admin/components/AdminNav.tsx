import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface AdminNavProps {
  communityId: string;
}

export function AdminNav({ communityId }: AdminNavProps) {
  const pathname = usePathname();
  const { isSuperAdmin } = useAuth();

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
    <div className="flex flex-col space-y-4">
      <Card className="p-4">
        <Link href="/community">
          <Button 
            variant="outline" 
            className="w-full justify-start space-x-3"
          >
            <span className="text-xl">←</span>
            <span>Volver a la Comunidad</span>
          </Button>
        </Link>
      </Card>

      {isSuperAdmin && (
        <Card className="p-4">
          <Link href="/superadmin/dashboard">
            <Button 
              variant="outline" 
              className="w-full justify-start space-x-3"
            >
              <span className="text-xl">⚡</span>
              <span>Panel Superadmin</span>
            </Button>
          </Link>
        </Card>
      )}
      
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
    </div>
  );
}
