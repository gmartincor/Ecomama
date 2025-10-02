import type { MembershipStatus } from "../types";

type RequestStatusProps = {
  status: MembershipStatus;
  className?: string;
};

const statusConfig: Record<
  MembershipStatus,
  { label: string; bgColor: string; textColor: string }
> = {
  PENDING: {
    label: "Pendiente",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  APPROVED: {
    label: "Aprobado",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  REJECTED: {
    label: "Rechazado",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
  },
  REMOVED: {
    label: "Removido",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
  },
};

export const RequestStatus = ({ status, className = "" }: RequestStatusProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.label}
    </span>
  );
};
