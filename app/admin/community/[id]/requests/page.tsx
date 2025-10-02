"use client";

import { use, useState } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { RequestList } from "@/features/memberships/components/RequestList";
import { useAdminRequests } from "@/features/memberships/hooks/useMembershipRequests";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function AdminRequestsPage({ params }: PageProps) {
  const { id: communityId } = use(params);
  const { requests, isLoading, error, respondToRequest } = useAdminRequests(communityId);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleApprove = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      await respondToRequest(requestId, "APPROVED");
    } catch (err) {
      console.error("Failed to approve request", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      await respondToRequest(requestId, "REJECTED");
    } catch (err) {
      console.error("Failed to reject request", err);
    } finally {
      setActionLoading(null);
    }
  };

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
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Solicitudes Pendientes</h1>

      {actionLoading && (
        <div className="mb-4 bg-blue-50 text-blue-600 p-3 rounded-md text-sm">
          Procesando solicitud...
        </div>
      )}

      <RequestList
        requests={requests}
        onApprove={handleApprove}
        onReject={handleReject}
        isAdmin
        emptyMessage="No hay solicitudes pendientes"
      />
    </div>
  );
}
