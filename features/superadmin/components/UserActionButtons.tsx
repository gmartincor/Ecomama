import { Button } from "@/components/ui/Button";
import type { UserStatus, UserRole } from "../types";

interface UserActionButtonsProps {
  userId: string;
  currentStatus: UserStatus;
  currentRole: UserRole;
  isProcessing: boolean;
  onStatusChange: (userId: string, status: UserStatus) => Promise<void>;
  onRoleToggle: (userId: string, currentRole: UserRole) => Promise<void>;
}

export function UserActionButtons({
  userId,
  currentStatus,
  currentRole,
  isProcessing,
  onStatusChange,
  onRoleToggle,
}: UserActionButtonsProps) {
  const getStatusButton = () => {
    switch (currentStatus) {
      case "ACTIVE":
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(userId, "INACTIVE")}
              disabled={isProcessing}
              className="text-yellow-600 hover:text-yellow-700"
            >
              Desactivar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onStatusChange(userId, "SUSPENDED")}
              disabled={isProcessing}
            >
              Suspender
            </Button>
          </>
        );
      case "INACTIVE":
        return (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(userId, "ACTIVE")}
              disabled={isProcessing}
              className="text-green-600 hover:text-green-700"
            >
              Activar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onStatusChange(userId, "SUSPENDED")}
              disabled={isProcessing}
            >
              Suspender
            </Button>
          </>
        );
      case "SUSPENDED":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange(userId, "ACTIVE")}
            disabled={isProcessing}
            className="text-green-600 hover:text-green-700"
          >
            Reactivar
          </Button>
        );
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onRoleToggle(userId, currentRole)}
        disabled={isProcessing}
      >
        {currentRole === "ADMIN" ? "↓ USER" : "↑ ADMIN"}
      </Button>
      {getStatusButton()}
    </div>
  );
}
