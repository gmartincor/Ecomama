import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type AuthorCardProps = {
  name: string;
  email: string;
  phone?: string;
  isOwner?: boolean;
  onViewProfile?: () => void;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const AuthorCard = ({
  name,
  email,
  phone,
  isOwner = false,
  onViewProfile,
}: AuthorCardProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>👤</span>
        Publicado por
      </h2>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xl font-bold">
            {getInitials(name)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <button
            onClick={onViewProfile}
            className="text-lg font-semibold mb-1 hover:text-primary transition-colors cursor-pointer text-left"
          >
            {name}
          </button>
          
          <div className="space-y-1 mb-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span>✉️</span>
              {email}
            </p>
            
            {phone && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span>📞</span>
                {phone}
              </p>
            )}
          </div>

          {!isOwner && onViewProfile && (
            <Button onClick={onViewProfile} variant="primary">
              Ver Perfil Completo
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
