'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n';
import { useAuth } from '@/lib/auth-context';
import { registerSchema, RegisterFormData } from '@/lib/validations/auth.schema';
import { Button, Form } from '@/components/ui';
import { AuthLayout } from '@/components/layout';
import { FormInput, FormPasswordInput } from '@/components/forms';
import { AuthCard } from '@/components/auth';

export default function RegisterPage() {
  const t = useTranslations('auth.register');
  const { register: registerUser, isLoading } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    await registerUser(registerData);
  };

  const footer = (
    <div className="flex flex-col space-y-4 w-full">
      <div className="text-xs text-center text-muted-foreground">
        {t('termsAgree')}
      </div>
      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('haveAccount')} </span>
        <Link
          href="/auth/login"
          className="font-medium text-primary hover:underline"
        >
          {t('loginLink')}
        </Link>
      </div>
    </div>
  );

  return (
    <AuthLayout>
      <AuthCard title={t('title')} description={t('subtitle')} footer={footer}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="firstName"
                label={t('firstName')}
                autoComplete="given-name"
                disabled={isLoading}
              />
              <FormInput
                name="lastName"
                label={t('lastName')}
                autoComplete="family-name"
                disabled={isLoading}
              />
            </div>

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
