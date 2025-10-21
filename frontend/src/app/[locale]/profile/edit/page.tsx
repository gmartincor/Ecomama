'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { updateProfileSchema, UpdateProfileFormData } from '@/lib/validations/auth.schema';
import ProtectedRoute from '@/components/ProtectedRoute';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import FormError from '@/components/ui/FormError';

export default function EditProfilePage() {
  const t = useTranslations('profile');
  const router = useRouter();
  const { user, updateProfile, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        phoneNumber: user.profile.phoneNumber || '',
        bio: user.profile.bio || '',
        city: user.profile.city || '',
        country: user.profile.country || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    clearError();
    await updateProfile(data);
    if (!error) {
      router.push('/profile');
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-8 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900">{t('edit')}</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6">
              {error && <FormError message={error} />}

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    {...register('firstName')}
                    type="text"
                    label={t('firstName')}
                    error={errors.firstName?.message}
                    disabled={isLoading}
                  />

                  <Input
                    {...register('lastName')}
                    type="text"
                    label={t('lastName')}
                    error={errors.lastName?.message}
                    disabled={isLoading}
                  />
                </div>

                <Input
                  {...register('phoneNumber')}
                  type="tel"
                  label={t('phoneNumber')}
                  error={errors.phoneNumber?.message}
                  disabled={isLoading}
                />

                <Textarea
                  {...register('bio')}
                  label={t('bio')}
                  error={errors.bio?.message}
                  rows={4}
                  disabled={isLoading}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    {...register('city')}
                    type="text"
                    label={t('city')}
                    error={errors.city?.message}
                    disabled={isLoading}
                  />

                  <Input
                    {...register('country')}
                    type="text"
                    label={t('country')}
                    error={errors.country?.message}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/profile')}
                  disabled={isLoading}
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                >
                  {t('save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
