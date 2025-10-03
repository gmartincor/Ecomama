import { Badge } from "@/components/ui/Badge";
import type { MembershipStatus } from "../types";

type RequestStatusProps = {
  status: MembershipStatus;
};

const statusConfig: Record<MembershipStatus, { label: string; variant: 'warning' | 'success' | 'destructive' | 'muted' }> = {
  PENDING: {
    label: "Pendiente",
    variant: "warning",
  },
  APPROVED: {
    label: "Aprobado",
    variant: "success",
  },
  REJECTED: {
    label: "Rechazado",
    variant: "destructive",
  },
  REMOVED: {
    label: "Eliminado",
    variant: "muted",
  },
};

export const RequestStatus = ({ status }: RequestStatusProps) => {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};
