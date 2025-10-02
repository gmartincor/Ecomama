import { Card } from "@/components/ui/Card";
import type { GlobalStats as Stats } from "../types";

interface GlobalStatsProps {
  stats: Stats;
  onViewUsers?: () => void;
  onViewCommunities?: () => void;
}

export function GlobalStats({
  stats,
  onViewUsers,
  onViewCommunities,
}: GlobalStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onViewUsers}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Usuarios
            </p>
            <h3 className="text-3xl font-bold mt-2">{stats.totalUsers}</h3>
            <p className="text-xs text-green-600 mt-1">
              {stats.activeUsers} activos
            </p>
          </div>
          <div className="text-4xl">👥</div>
        </div>
      </Card>

      <Card
        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onViewCommunities}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Comunidades
            </p>
            <h3 className="text-3xl font-bold mt-2">{stats.totalCommunities}</h3>
            <p className="text-xs text-green-600 mt-1">
              {stats.activeCommunities} activas
            </p>
          </div>
          <div className="text-4xl">🏘️</div>
        </div>
        {stats.inactiveCommunities > 0 && (
          <div className="mt-2 text-xs text-orange-600 font-medium">
            ⚠️ {stats.inactiveCommunities} inactivas
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Publicaciones
            </p>
            <h3 className="text-3xl font-bold mt-2">{stats.totalListings}</h3>
          </div>
          <div className="text-4xl">📦</div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Eventos
            </p>
            <h3 className="text-3xl font-bold mt-2">{stats.totalEvents}</h3>
          </div>
          <div className="text-4xl">📅</div>
        </div>
      </Card>
    </div>
  );
}
