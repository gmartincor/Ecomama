import { Spinner } from '@/components/ui';
import { cn } from '@/lib/utils';

interface LoadingProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ message, className, size = 'md' }: LoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 p-8', className)}>
      <Spinner size={size} className="text-primary" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
