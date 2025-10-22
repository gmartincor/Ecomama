'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/validations/auth.schema';
import { Button, Form } from '@/components/ui';
import { AuthLayout } from '@/components/layout';
import { FormPasswordInput } from '@/components/forms';
import { AuthCard } from '@/components/auth';
import { toast } from '@/hooks/use-toast';

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

  useEffect(() => {
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Invalid Link',
        description: 'Password reset link is invalid or expired',
      });
      router.push('/auth/forgot-password');
    }
  }, [token, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.resetPassword(data);
      if (response.success) {
        toast({
          title: 'Success',
          description: t('successMessage'),
        });
        router.push('/auth/login');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error?.message || 'Failed to reset password',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <AuthLayout>
      <AuthCard title={t('title')} description={t('subtitle')}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register('token')} />

            <FormPasswordInput
              name="newPassword"
              label={t('newPassword')}
              description="Must be at least 8 characters with uppercase, lowercase, and number"
              autoComplete="new-password"
              disabled={isLoading}
            />

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
    </AuthLayout>
  );
}
