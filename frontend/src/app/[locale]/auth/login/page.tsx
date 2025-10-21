'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n';
import { useAuth } from '@/lib/auth-context';
import { loginSchema, LoginFormData } from '@/lib/validations/auth.schema';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import FormError from '@/components/ui/FormError';

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const { login, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    await login(data);
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <FormError message={error} />}

          <div className="space-y-4">
            <Input
              {...register('email')}
              type="email"
              label={t('email')}
              error={errors.email?.message}
              autoComplete="email"
              disabled={isLoading}
            />

            <Input
              {...register('password')}
              type="password"
              label={t('password')}
              error={errors.password?.message}
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              {t('forgotPassword')}
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            {t('submit')}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">{t('noAccount')} </span>
            <Link
              href="/auth/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t('registerLink')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
