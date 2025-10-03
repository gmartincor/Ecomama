"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CommunityEditForm } from "@/features/admin/components";
import { useAdminCommunity } from "@/features/admin/hooks";
import type { Community } from "@prisma/client";

export default function AdminSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const communityId = params?.id as string;
  const { updateCommunity } = useAdminCommunity(communityId);
  const [community, setCommunity] = useState<Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await fetch(`/api/communities/${communityId}`);
        if (!response.ok) throw new Error("Failed to fetch community");
        const data = await response.json();
        setCommunity(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading community");
      } finally {
        setIsLoading(false);
      }
    };

    if (communityId) {
      fetchCommunity();
    }
  }, [communityId]);

  const handleUpdate = async (data: any) => {
    await updateCommunity(data);
    router.push(`/admin/community/${communityId}/dashboard`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando configuración...</p>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-destructive">Error: {error || "Community not found"}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configuración de la Comunidad</h1>
        <p className="text-muted-foreground mt-2">
          Edita la información de tu comunidad
        </p>
      </div>
      <CommunityEditForm 
        community={community}
        onSubmit={handleUpdate}
        onCancel={() => router.push(`/admin/community/${communityId}/dashboard`)}
      />
    </div>
  );
}
