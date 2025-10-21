'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n';
import { authService } from '@/services/auth.service';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/validations/auth.schema';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import FormError from '@/components/ui/FormError';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(data);
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.error?.message || 'An error occurred');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        {success ? (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-green-800">{t('successMessage')}</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && <FormError message={error} />}

            <Input
              {...register('email')}
              type="email"
              label={t('email')}
              error={errors.email?.message}
              autoComplete="email"
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              {t('submit')}
            </Button>
          </form>
        )}

        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}
