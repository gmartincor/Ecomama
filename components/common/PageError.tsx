import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type PageErrorProps = {
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
};

export const PageError = ({ message, onRetry, onBack }: PageErrorProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 text-center">
          <p className="text-destructive mb-4">{message}</p>
          <div className="flex gap-4 justify-center">
            {onRetry && (
              <Button onClick={onRetry} variant="primary">
                Intentar de nuevo
              </Button>
            )}
            {onBack && (
              <Button onClick={onBack} variant="outline">
                Volver
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
