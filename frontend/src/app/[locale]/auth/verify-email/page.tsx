'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/lib/auth-context';
import Button from '@/components/ui/Button';

export default function VerifyEmailPage() {
  const t = useTranslations('auth.verifyEmail');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage(t('error'));
        return;
      }

      try {
        const response = await authService.verifyEmail(email, { token });
        if (response.success) {
          setStatus('success');
          setMessage(t('success'));
          setTimeout(() => router.push('/'), 2000);
        } else {
          setStatus('error');
          setMessage(response.error?.message || t('error'));
        }
      } catch (err) {
        setStatus('error');
        setMessage(t('error'));
      }
    };

    if (searchParams.get('token')) {
      verifyEmail();
    }
  }, [searchParams, router, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-8">
          {status === 'verifying' && (
            <div className="flex flex-col items-center space-y-4">
              <svg
                className="animate-spin h-12 w-12 text-primary-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-gray-700">{t('verifying')}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-6">
              <svg
                className="mx-auto h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="mt-4 text-green-800">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 border border-red-200 p-6">
                <svg
                  className="mx-auto h-12 w-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <p className="mt-4 text-red-800">{message}</p>
              </div>

              {user && !user.emailVerified && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => router.push('/')}
                >
                  {t('resend')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
