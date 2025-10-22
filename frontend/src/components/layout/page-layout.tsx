import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-muted/40', className)}>
      {children}
    </div>
  );
}

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  full: 'max-w-full',
};

export function PageContainer({ children, className, maxWidth = '3xl' }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-4 py-12 sm:px-6 lg:px-8', maxWidthClasses[maxWidth], className)}>
      {children}
    </div>
  );
}

interface PageSectionProps {
  children: ReactNode;
  className?: string;
}

export function PageSection({ children, className }: PageSectionProps) {
  return (
    <section className={cn('space-y-6', className)}>
      {children}
    </section>
  );
}

interface CenteredLayoutProps {
  children: ReactNode;
  className?: string;
}

export function CenteredLayout({ children, className }: CenteredLayoutProps) {
  return (
    <div className={cn('flex min-h-screen items-center justify-center bg-muted/40 p-4', className)}>
      {children}
    </div>
  );
}
