"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RequestStatus } from "./RequestStatus";
import { useMembershipRequests } from "../hooks/useMembershipRequests";
import { useRouter } from "next/navigation";
import type { MemberWithCommunity } from "../types";

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

type RequestItemProps = {
  request: MemberWithCommunity;
};

const RequestItem = ({ request }: RequestItemProps) => {
  const router = useRouter();

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{request.community.name}</h3>
          <p className="text-sm text-muted-foreground">
            {request.community.city}, {request.community.country}
          </p>
        </div>
        <RequestStatus status={request.status} />
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Tu mensaje:</p>
          <p className="text-sm text-foreground">{request.requestMessage}</p>
        </div>

        {request.responseMessage && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Respuesta del administrador:</p>
            <p className="text-sm text-foreground">{request.responseMessage}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Solicitado el {formatDate(request.requestedAt)}
        </p>

        {request.respondedAt && (
          <p className="text-xs text-muted-foreground">
            Respondido el {formatDate(request.respondedAt)}
          </p>
        )}
      </div>

      {request.status === "REJECTED" && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/communities/${request.community.id}/request`)}
            className="w-full"
          >
            Solicitar de nuevo
          </Button>
        </div>
      )}
    </Card>
  );
};

export const UserMembershipRequests = () => {
  const { requests, isLoading, error } = useMembershipRequests();

  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Cargando solicitudes...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600">{error}</p>
      </Card>
    );
  }

  if (requests.length === 0) {
    return null;
  }

  const pendingRequests = requests.filter(r => r.status === "PENDING");
  const rejectedRequests = requests.filter(r => r.status === "REJECTED");
  const relevantRequests = [...pendingRequests, ...rejectedRequests];

  if (relevantRequests.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>📋</span>
          Solicitudes de Membresía
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {pendingRequests.length > 0 && `${pendingRequests.length} pendiente${pendingRequests.length !== 1 ? 's' : ''}`}
          {pendingRequests.length > 0 && rejectedRequests.length > 0 && " • "}
          {rejectedRequests.length > 0 && `${rejectedRequests.length} rechazada${rejectedRequests.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="space-y-3">
        {relevantRequests.map((request) => (
          <RequestItem key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
};
