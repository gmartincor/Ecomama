"use client";

import { RequestCard } from "./RequestCard";
import type { MemberWithUser, MemberWithCommunity } from "../types";

type RequestListProps = {
  requests: (MemberWithUser | MemberWithCommunity)[];
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  isAdmin?: boolean;
  emptyMessage?: string;
};

export const RequestList = ({
  requests,
  onApprove,
  onReject,
  isAdmin = false,
  emptyMessage = "No hay solicitudes",
}: RequestListProps) => {
  if (requests.length === 0) {
    return (
            <div className="text-center py-8 text-muted-foreground">
        No hay solicitudes pendientes
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request as MemberWithUser}
          onApprove={onApprove}
          onReject={onReject}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};
