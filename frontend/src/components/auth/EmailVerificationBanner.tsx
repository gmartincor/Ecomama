'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const t = useTranslations('auth.verifyEmail');
  const [dismissed, setDismissed] = useState(false);

  if (!user || user.emailVerified || dismissed) {
    return null;
  }

  return (
    <Alert className={cn(
      'rounded-none border-x-0 border-t-0',
      'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
    )}>
      <div className="container flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <AlertDescription className={cn(
            'text-amber-800 dark:text-amber-200',
            'truncate sm:text-clip'
          )}>
            <span className="sm:hidden">{t('emailNotVerified')}</span>
            <span className="hidden sm:inline">{t('subtitle')}</span>
          </AlertDescription>
        </div>
        <Button
          onClick={() => setDismissed(true)}
          variant="ghost"
          size="icon"
          className={cn(
            'flex-shrink-0 h-8 w-8',
            'text-amber-600 hover:bg-amber-100',
            'dark:text-amber-400 dark:hover:bg-amber-900'
          )}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
