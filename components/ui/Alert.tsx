import { cn } from '@/lib/utils/cn';

type AlertProps = {
  variant?: 'info' | 'success' | 'warning' | 'destructive';
  children: React.ReactNode;
  className?: string;
};

export const Alert = ({ variant = 'info', children, className }: AlertProps) => {
  const variants = {
    info: 'bg-info-light text-info border-info/20',
    success: 'bg-success-light text-success border-success/20',
    warning: 'bg-warning-light text-warning border-warning/20',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <div className={cn('p-3 rounded-md text-sm border', variants[variant], className)}>
      {children}
    </div>
  );
};
