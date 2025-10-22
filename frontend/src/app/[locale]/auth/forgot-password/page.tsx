'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n';
import { authService } from '@/services/auth.service';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/validations/auth.schema';
import { Button, Form } from '@/components/ui';
import { CenteredLayout } from '@/components/layout';
import { FormInput } from '@/components/forms';
import { AuthCard, SuccessAlert } from '@/components/auth';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(data);
      if (response.success) {
        setSuccess(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredLayout>
      <AuthCard title={t('title')} description={t('subtitle')}>
        {success ? (
          <div className="space-y-4">
            <SuccessAlert message={t('successMessage')} />
            <Link href="/auth/login">
              <Button className="w-full" variant="outline">
                {t('backToLogin')}
              </Button>
            </Link>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                name="email"
                label={t('email')}
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                disabled={isLoading}
              />

              <Button type="submit" className="w-full" isLoading={isLoading}>
                {t('submit')}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {t('backToLogin')}
                </Link>
              </div>
            </form>
          </Form>
        )}
      </AuthCard>
    </CenteredLayout>
  );
}
