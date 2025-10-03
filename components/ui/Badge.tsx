import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { badgeVariants } from '@/lib/design';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'muted', children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };
