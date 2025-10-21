'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth-context';
import { changePasswordSchema, ChangePasswordFormData } from '@/lib/validations/auth.schema';
import ProtectedRoute from '@/components/ProtectedRoute';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import FormError from '@/components/ui/FormError';
import PasswordStrength from '@/components/ui/PasswordStrength';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const { changePassword, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watch('newPassword', '');

  const onSubmit = async (data: ChangePasswordFormData) => {
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      await changePassword(data);
      setSuccess(true);
      reset();
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-8 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            </div>

            <div className="px-6 py-6 space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('changePassword.title')}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {error && <FormError message={error} />}
                  
                  {success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                      <p className="text-sm text-green-800">
                        {t('changePassword.success')}
                      </p>
                    </div>
                  )}

                  <Input
                    {...register('currentPassword')}
                    type="password"
                    label={t('changePassword.currentPassword')}
                    error={errors.currentPassword?.message}
                    disabled={isLoading}
                  />

                  <div>
                    <Input
                      {...register('newPassword')}
                      type="password"
                      label={t('changePassword.newPassword')}
                      error={errors.newPassword?.message}
                      disabled={isLoading}
                    />
                    <PasswordStrength password={newPassword} />
                  </div>

                  <Input
                    {...register('confirmPassword')}
                    type="password"
                    label={t('changePassword.confirmPassword')}
                    error={errors.confirmPassword?.message}
                    disabled={isLoading}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={success}
                  >
                    {t('changePassword.submit')}
                  </Button>
                </form>
              </div>

              <hr className="border-gray-200" />

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('dangerZone.title')}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {t('dangerZone.description')}
                </p>
                <Button variant="ghost" onClick={() => logout()}>
                  {t('logout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
