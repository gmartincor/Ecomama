import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessAlertProps {
  message: string;
  className?: string;
}

export function SuccessAlert({ message, className }: SuccessAlertProps) {
  return (
    <Alert className={cn('bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800', className)}>
      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertDescription className="text-green-800 dark:text-green-200">
        {message}
      </AlertDescription>
    </Alert>
  );
}
