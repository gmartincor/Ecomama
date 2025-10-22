'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth-context';
import { changePasswordSchema, ChangePasswordFormData } from '@/lib/validations/auth.schema';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Form, FormDescription, FormItem } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { AlertCircle, LogOut } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageLayout, PageContainer, PageSection } from '@/components/layout';
import { FormPasswordInput } from '@/components/forms';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const { changePassword, logout, isLoading } = useAuth();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    await changePassword(data);
    form.reset();
  };

  return (
    <ProtectedRoute>
      <Navigation />
      <PageLayout>
        <PageContainer>
          <PageSection>
            <div>
              <h1 className="text-3xl font-bold">{t('title')}</h1>
              <p className="text-muted-foreground mt-2">
                Manage your account settings and preferences
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t('changePassword.title')}</CardTitle>
                <CardDescription>
                  Ensure your account is using a strong password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormPasswordInput
                      name="currentPassword"
                      label={t('changePassword.currentPassword')}
                      autoComplete="current-password"
                      disabled={isLoading}
                    />

                    <FormItem>
                      <FormPasswordInput
                        name="newPassword"
                        label={t('changePassword.newPassword')}
                        autoComplete="new-password"
                        disabled={isLoading}
                      />
                      <FormDescription>
                        Must be at least 8 characters with uppercase, lowercase, and number
                      </FormDescription>
                    </FormItem>

                    <FormPasswordInput
                      name="confirmPassword"
                      label={t('changePassword.confirmPassword')}
                      autoComplete="new-password"
                      disabled={isLoading}
                    />

                    <Button type="submit" isLoading={isLoading}>
                      {t('changePassword.submit')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">
                  {t('dangerZone.title')}
                </CardTitle>
                <CardDescription>
                  {t('dangerZone.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Logging out will end your current session
                  </AlertDescription>
                </Alert>
                <Button variant="destructive" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('logout')}
                </Button>
              </CardContent>
            </Card>
          </PageSection>
        </PageContainer>
      </PageLayout>
    </ProtectedRoute>
  );
}
