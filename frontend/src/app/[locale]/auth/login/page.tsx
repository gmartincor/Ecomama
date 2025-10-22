'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n';
import { useAuth } from '@/lib/auth-context';
import { loginSchema, LoginFormData } from '@/lib/validations/auth.schema';
import { Button, Form } from '@/components/ui';
import { AuthLayout } from '@/components/layout';
import { FormInput, FormPasswordInput } from '@/components/forms';
import { AuthCard } from '@/components/auth';

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const { login, isLoading } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <AuthLayout>
      <AuthCard title={t('title')} description={t('subtitle')}>
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

            <FormPasswordInput
              name="password"
              label={t('password')}
              autoComplete="current-password"
              disabled={isLoading}
            />

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                {t('forgotPassword')}
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              {t('submit')}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t('noAccount')} </span>
              <Link
                href="/auth/register"
                className="font-medium text-primary hover:underline"
              >
                {t('registerLink')}
              </Link>
            </div>
          </form>
        </Form>
      </AuthCard>
    </AuthLayout>
  );
}
