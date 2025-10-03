import { Button } from "@/components/ui/Button";

type LogoutButtonProps = {
  onLogout: () => void;
};

export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onLogout}
      className="px-3"
      aria-label="Cerrar sesión"
    >
      <span className="hidden sm:inline">Salir</span>
      <span className="sm:hidden">🚪</span>
    </Button>
  );
};
