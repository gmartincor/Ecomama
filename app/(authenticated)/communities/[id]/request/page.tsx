"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useCommunity } from "@/features/communities/hooks/useCommunities";
import { RequestForm } from "@/features/memberships/components/RequestForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function RequestMembershipPage({ params }: PageProps) {
  const router = useRouter();
  const { id: communityId } = use(params);

  const { community, isLoading, error } = useCommunity(communityId);

  const handleSuccess = () => {
    router.push("/requests/pending");
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error || "Comunidad no encontrada"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Solicitar Membresía</h1>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold">{community.name}</h2>
        <p className="text-gray-600">{community.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          📍 {community.city}, {community.country}
        </p>
      </div>

      <RequestForm
        communityId={communityId}
        communityName={community.name}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
