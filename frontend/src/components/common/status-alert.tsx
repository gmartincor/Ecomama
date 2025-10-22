import { Alert, AlertDescription, AlertTitle } from '@/components/ui';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusAlertProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  className?: string;
}

const variantConfig = {
  success: {
    icon: CheckCircle2,
    className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    iconClassName: 'text-green-600 dark:text-green-400',
    textClassName: 'text-green-800 dark:text-green-200',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    iconClassName: 'text-red-600 dark:text-red-400',
    textClassName: 'text-red-800 dark:text-red-200',
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
    iconClassName: 'text-amber-600 dark:text-amber-400',
    textClassName: 'text-amber-800 dark:text-amber-200',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    iconClassName: 'text-blue-600 dark:text-blue-400',
    textClassName: 'text-blue-800 dark:text-blue-200',
  },
};

export function StatusAlert({ variant, title, message, className }: StatusAlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Alert className={cn(config.className, className)}>
      <Icon className={cn('h-4 w-4', config.iconClassName)} />
      {title && <AlertTitle className={config.textClassName}>{title}</AlertTitle>}
      <AlertDescription className={config.textClassName}>{message}</AlertDescription>
    </Alert>
  );
}
