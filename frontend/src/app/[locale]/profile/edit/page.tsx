'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { updateProfileSchema, UpdateProfileFormData } from '@/lib/validations/auth.schema';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageLayout, PageContainer } from '@/components/layout';
import { FormInput, FormTextarea } from '@/components/forms';

export default function EditProfilePage() {
  const t = useTranslations('profile');
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuth();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      bio: '',
      city: '',
      country: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        phoneNumber: user.profile.phoneNumber || '',
        bio: user.profile.bio || '',
        city: user.profile.city || '',
        country: user.profile.country || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    await updateProfile(data);
    router.push('/profile');
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <PageLayout>
        <PageContainer maxWidth='2xl'>
          <Card>
            <CardHeader>
              <CardTitle>{t('edit')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormInput
                      name="firstName"
                      label={t('firstName')}
                      disabled={isLoading}
                    />
                    <FormInput
                      name="lastName"
                      label={t('lastName')}
                      disabled={isLoading}
                    />
                  </div>

                  <FormInput
                    name="phoneNumber"
                    label={t('phoneNumber')}
                    type="tel"
                    disabled={isLoading}
                  />

                  <FormTextarea
                    name="bio"
                    label={t('bio')}
                    rows={4}
                    disabled={isLoading}
                  />

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormInput
                      name="city"
                      label={t('city')}
                      disabled={isLoading}
                    />
                    <FormInput
                      name="country"
                      label={t('country')}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/profile')}
                      disabled={isLoading}
                    >
                      {t('cancel')}
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                      {t('save')}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </PageContainer>
      </PageLayout>
    </ProtectedRoute>
  );
}
