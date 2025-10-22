'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from '@/i18n';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
  showBackButton?: boolean;
}

export function AuthLayout({ children, className, showBackButton = true }: AuthLayoutProps) {
  const router = useRouter();

  return (
    <div className={cn(
      'flex min-h-screen items-center justify-center bg-muted/40 p-4',
      className
    )}>
      {showBackButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      {children}
    </div>
  );
}
