"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCommunityStore } from "@/lib/stores/useCommunityStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { activeCommunity, userCommunities } = useCommunityStore();

  useEffect(() => {
    if (!isLoading && activeCommunity) {
      router.push("/community");
    }
  }, [isLoading, activeCommunity, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <Card className="p-6">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Bienvenido, {user?.name}</h2>
          
          {userCommunities.length === 0 ? (
            <>
              <p className="text-gray-600">
                Aún no eres miembro de ninguna comunidad
              </p>
              <Button onClick={() => router.push("/communities/map")}>
                Explorar Comunidades
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-600">
                Selecciona una comunidad para ver su dashboard
              </p>
              <Button onClick={() => router.push("/settings")}>
                Configurar Comunidad Predeterminada
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
