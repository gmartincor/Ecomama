'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/validations/auth.schema';
import { Button, Form, FormDescription, FormItem } from '@/components/ui';
import { CenteredLayout } from '@/components/layout';
import { FormPasswordInput } from '@/components/forms';
import { AuthCard } from '@/components/auth';

export default function ResetPasswordPage() {
  const t = useTranslations('auth.resetPassword');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword(data);
      if (response.success) {
        router.push('/auth/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredLayout>
      <AuthCard title={t('title')} description={t('subtitle')}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register('token')} />

            <FormItem>
              <FormPasswordInput
                name="newPassword"
                label={t('newPassword')}
                autoComplete="new-password"
                disabled={isLoading}
              />
              <FormDescription>
                Must be at least 8 characters with uppercase, lowercase, and number
              </FormDescription>
            </FormItem>

            <FormPasswordInput
              name="confirmPassword"
              label={t('confirmPassword')}
              autoComplete="new-password"
              disabled={isLoading}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {t('submit')}
            </Button>
          </form>
        </Form>
      </AuthCard>
    </CenteredLayout>
  );
}
