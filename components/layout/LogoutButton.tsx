import { Button } from "@/components/ui/Button";

type LogoutButtonProps = {
  onLogout: () => void;
  isLoading?: boolean;
};

export const LogoutButton = ({ onLogout, isLoading }: LogoutButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onLogout}
      className="px-3"
      aria-label="Cerrar sesión"
      disabled={isLoading}
      isLoading={isLoading}
    >
      <span className="hidden sm:inline">Salir</span>
      <span className="sm:hidden">🚪</span>
    </Button>
  );
};
