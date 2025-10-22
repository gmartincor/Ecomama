import { ComponentProps } from 'react';
import { Link } from '@/i18n';
import { cn } from '@/lib/utils';

interface NavLinkProps extends ComponentProps<typeof Link> {
  active?: boolean;
}

export function NavLink({ href, children, active, className, ...props }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors hover:text-primary',
        active ? 'text-foreground' : 'text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
