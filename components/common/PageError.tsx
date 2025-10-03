import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type PageErrorProps = {
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
};

export const PageError = ({ message, onRetry, onBack }: PageErrorProps) => {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-4 sm:p-6 text-center">
          <p className="text-sm sm:text-base text-destructive mb-4 break-words">{message}</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            {onRetry && (
              <Button onClick={onRetry} variant="primary" className="w-full sm:w-auto">
                Intentar de nuevo
              </Button>
            )}
            {onBack && (
              <Button onClick={onBack} variant="outline" className="w-full sm:w-auto">
                Volver
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
