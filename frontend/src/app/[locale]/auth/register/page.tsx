'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n';
import { useAuth } from '@/lib/auth-context';
import { registerSchema, RegisterFormData } from '@/lib/validations/auth.schema';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import FormError from '@/components/ui/FormError';

export default function RegisterPage() {
  const t = useTranslations('auth.register');
  const { register: registerUser, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    const { confirmPassword, ...registerData } = data;
    await registerUser(registerData);
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
            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register('firstName')}
                type="text"
                label={t('firstName')}
                error={errors.firstName?.message}
                autoComplete="given-name"
                disabled={isLoading}
              />

              <Input
                {...register('lastName')}
                type="text"
                label={t('lastName')}
                error={errors.lastName?.message}
                autoComplete="family-name"
                disabled={isLoading}
              />
            </div>

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
              autoComplete="new-password"
              disabled={isLoading}
            />

            <Input
              {...register('confirmPassword')}
              type="password"
              label={t('confirmPassword')}
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          <div className="text-xs text-gray-600">
            {t('termsAgree')}
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
            <span className="text-gray-600">{t('haveAccount')} </span>
            <Link
              href="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t('loginLink')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
