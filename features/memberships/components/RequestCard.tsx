"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RequestStatus } from "./RequestStatus";
import type { MemberWithUser } from "../types";

type RequestCardProps = {
  request: MemberWithUser;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  isAdmin?: boolean;
};

export const RequestCard = ({
  request,
  onApprove,
  onReject,
  isAdmin = false,
}: RequestCardProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{request.user.name}</h3>
          <p className="text-sm text-muted-foreground">{request.user.email}</p>
        </div>
        <RequestStatus status={request.status} />
      </div>

      {request.requestMessage && (
        <div className="mb-3">
          <p className="text-sm font-medium text-muted-foreground">Mensaje:</p>
          <p className="text-sm">{request.requestMessage}</p>
        </div>
      )}

      {request.responseMessage && (
        <div className="mb-3">
          <p className="text-sm font-medium text-muted-foreground">Respuesta:</p>
          <p className="text-sm">{request.responseMessage}</p>
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

      {isAdmin && request.status === "PENDING" && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          <Button
            size="sm"
            variant="success"
            onClick={() => onApprove?.(request.id)}
            className="flex-1"
          >
            Aprobar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onReject?.(request.id)}
            className="flex-1"
          >
            Rechazar
          </Button>
        </div>
      )}
    </Card>
  );
};
