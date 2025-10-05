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
  const { user, isLoading, isSuperAdmin } = useAuth();
  const { activeCommunity, userCommunities } = useCommunityStore();

  useEffect(() => {
    if (!isLoading && isSuperAdmin) {
      router.push("/superadmin/dashboard");
      return;
    }

    if (!isLoading && activeCommunity) {
      router.push("/community");
    }
  }, [isLoading, isSuperAdmin, activeCommunity, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bienvenido, {user?.name}</h1>

      <Card className="p-6">
        <div className="text-center space-y-4">
          {userCommunities.length === 0 ? (
            <>
              <h2 className="text-xl font-semibold">No eres miembro de ninguna comunidad</h2>
              <p className="text-muted-foreground">
                Explora el mapa y únete a una comunidad para comenzar
              </p>
              <Button onClick={() => router.push("/communities/map")}>
                Explorar Comunidades
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">Selecciona una comunidad</h2>
              <p className="text-muted-foreground">
                Usa el selector de comunidades en el header para ver su dashboard
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
