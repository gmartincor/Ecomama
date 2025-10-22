'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/lib/auth-context';
import { Alert, AlertDescription, Button, Spinner } from '@/components/ui';
import { SuccessAlert } from '@/components/auth';
import { XCircle } from 'lucide-react';
import { CenteredLayout } from '@/components/layout';

type VerificationStatus = 'idle' | 'verifying' | 'success' | 'error' | 'already-verified';

export default function VerifyEmailPage() {
  const t = useTranslations('auth.verifyEmail');
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const { refreshUser, user } = useAuth();
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [message, setMessage] = useState('');
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasVerifiedRef.current) return;

      const token = searchParams.get('token');

      if (!token) {
        if (user?.emailVerified) {
          setStatus('already-verified');
          setMessage(t('alreadyVerified'));
        } else {
          setStatus('error');
          setMessage(t('subtitle'));
        }
        return;
      }

      hasVerifiedRef.current = true;
      setStatus('verifying');

      try {
        const response = await authService.verifyEmail({ token });
        
        if (response.success) {
          setStatus('success');
          setMessage(t('success'));
          await refreshUser();
          setTimeout(() => router.push(`/${locale}`), 2000);
        } else {
          setStatus('error');
          const errorMsg = response.error?.message || '';
          
          if (errorMsg.toLowerCase().includes('expired')) {
            setMessage(t('expiredToken'));
          } else if (errorMsg.toLowerCase().includes('invalid')) {
            setMessage(t('invalidToken'));
          } else if (errorMsg.toLowerCase().includes('already')) {
            setStatus('already-verified');
            setMessage(t('alreadyVerified'));
            await refreshUser();
            setTimeout(() => router.push(`/${locale}`), 2000);
          } else {
            setMessage(errorMsg || t('error'));
          }
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setMessage(t('error'));
      }
    };

    verifyEmail();
  }, [searchParams, user, locale, router, t, refreshUser]);

  return (
    <CenteredLayout>
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-bold">{t('title')}</h2>
          {status === 'idle' && (
            <p className="mt-2 text-sm text-muted-foreground">{t('subtitle')}</p>
          )}
        </div>

        <div className="mt-8">
          {(status === 'idle' || status === 'verifying') && (
            <div className="flex flex-col items-center space-y-4">
              <Spinner size="lg" className="text-primary" />
              <p className="text-muted-foreground">{t('verifying')}</p>
            </div>
          )}

          {(status === 'success' || status === 'already-verified') && (
            <SuccessAlert message={message} className="text-left" />
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive" className="text-left">
                <XCircle className="h-5 w-5" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <Button className="w-full" onClick={() => router.push(`/${locale}`)}>
                {t('resend')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </CenteredLayout>
  );
}
