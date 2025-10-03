"use client";

import { Card } from "@/components/ui/Card";
import type { CommunityStats as Stats } from "../types";

interface CommunityStatsProps {
  stats: Stats;
  onViewPendingRequests?: () => void;
  onViewMembers?: () => void;
  onViewOffers?: () => void;
  onViewDemands?: () => void;
}

export function CommunityStats({
  stats,
  onViewPendingRequests,
  onViewMembers,
  onViewOffers,
  onViewDemands,
}: CommunityStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card 
        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onViewMembers}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Miembros Activos</p>
            <h3 className="text-3xl font-bold mt-2">{stats.membersCount}</h3>
          </div>
          <div className="text-4xl">👥</div>
        </div>
      </Card>

      <Card 
        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onViewPendingRequests}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Solicitudes Pendientes</p>
            <h3 className="text-3xl font-bold mt-2">{stats.pendingRequestsCount}</h3>
          </div>
          <div className="text-4xl">📋</div>
        </div>
        {stats.pendingRequestsCount > 0 && (
          <div className="mt-2 text-xs text-orange-600 font-medium">
            ⚠️ Requiere atención
          </div>
        )}
      </Card>

      <Card 
        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onViewOffers}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ofertas Activas</p>
            <h3 className="text-3xl font-bold mt-2">{stats.offersCount}</h3>
          </div>
          <div className="text-4xl">🌾</div>
        </div>
      </Card>

      <Card 
        className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onViewDemands}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Demandas Activas</p>
            <h3 className="text-3xl font-bold mt-2">{stats.demandsCount}</h3>
          </div>
          <div className="text-4xl">🛒</div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Publicaciones</p>
            <h3 className="text-3xl font-bold mt-2">{stats.activeListingsCount}</h3>
          </div>
          <div className="text-4xl">📦</div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Eventos Creados</p>
            <h3 className="text-3xl font-bold mt-2">{stats.eventsCount}</h3>
          </div>
          <div className="text-4xl">📅</div>
        </div>
      </Card>
    </div>
  );
}
