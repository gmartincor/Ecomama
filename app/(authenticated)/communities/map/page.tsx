"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/Input";
import { useCommunities } from "@/features/communities/hooks/useCommunities";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useCommunityStore } from "@/lib/stores/useCommunityStore";

const CommunityMap = dynamic(
  () => import("@/features/communities/components/CommunityMap").then((mod) => ({ default: mod.CommunityMap })),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

export default function CommunityMapPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { communities, isLoading, error } = useCommunities({
    status: "ACTIVE",
    search: searchTerm,
  });
  const { userCommunities } = useCommunityStore();

  const userCommunityIds = new Set(userCommunities.map((c) => c.id));

  const markers = communities.map((community) => ({
    id: community.id,
    position: [community.latitude, community.longitude] as [number, number],
    name: community.name,
    description: `${community.city}, ${community.country}`,
    isMember: userCommunityIds.has(community.id),
  }));

  const center: [number, number] = markers.length > 0 ? markers[0].position : [40.4168, -3.7038];

  const handleMarkerAction = (communityId: string) => {
    const isMember = userCommunityIds.has(communityId);
    if (isMember) {
      router.push("/community");
    } else {
      router.push(`/communities/${communityId}/request`);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Explorar Comunidades</h1>
        <Input
          type="text"
          placeholder="Buscar comunidades por nombre o ubicación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20">{error}</div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {communities.length} {communities.length === 1 ? "comunidad encontrada" : "comunidades encontradas"}
          </p>
          <CommunityMap
            center={center}
            zoom={6}
            markers={markers}
            onMarkerAction={handleMarkerAction}
            className="h-[600px] w-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
