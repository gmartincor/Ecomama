"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCommunities } from "@/features/communities/hooks/useCommunities";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function CommunitiesListPage() {
  const { communities, isLoading, error } = useCommunities({ status: "ACTIVE" });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Comunidades</h1>
        <Link href="/superadmin/communities/new">
          <Button>+ Nueva Comunidad</Button>
        </Link>
      </div>

      {communities.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No hay comunidades creadas</p>
          <Link href="/superadmin/communities/new">
            <Button>Crear primera comunidad</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community) => (
            <Card key={community.id} className="p-6">
              <h3 className="text-xl font-semibold mb-2">{community.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{community.description}</p>
              <div className="space-y-1 text-sm text-gray-500">
                <p>
                  📍 {community.city}, {community.country}
                </p>
                <p>👥 {community._count?.members || 0} miembros</p>
                <p>📦 {community._count?.listings || 0} publicaciones</p>
                <p>📅 {community._count?.events || 0} eventos</p>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Admin: {community.admin.name}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
