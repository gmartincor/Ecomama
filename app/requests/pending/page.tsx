"use client";

import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { RequestStatus } from "@/features/memberships/components/RequestStatus";
import { useMembershipRequests } from "@/features/memberships/hooks/useMembershipRequests";

export default function PendingRequestsPage() {
  const { requests, isLoading, error } = useMembershipRequests();

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Mis Solicitudes</h1>

      {requests.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No tienes solicitudes de membresía</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{request.community.name}</h3>
                  <p className="text-sm text-gray-600">
                    {request.community.city}, {request.community.country}
                  </p>
                </div>
                <RequestStatus status={request.status} />
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Tu mensaje:</p>
                  <p className="text-sm text-gray-600">{request.requestMessage}</p>
                </div>

                {request.responseMessage && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Respuesta del administrador:</p>
                    <p className="text-sm text-gray-600">{request.responseMessage}</p>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Solicitado el {formatDate(request.requestedAt)}
                </p>

                {request.respondedAt && (
                  <p className="text-xs text-gray-500">
                    Respondido el {formatDate(request.respondedAt)}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
