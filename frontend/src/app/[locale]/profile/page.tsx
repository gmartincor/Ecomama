'use client';

import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { Calendar, Mail, MapPin, Phone, User } from 'lucide-react';
import { Link } from '@/i18n';
import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const { user } = useAuth();

  if (!user) return null;

  const profileFields = [
    { icon: User, label: t('firstName'), value: user.profile.firstName },
    { icon: User, label: t('lastName'), value: user.profile.lastName },
    { icon: Mail, label: t('email'), value: user.email },
    { icon: Phone, label: t('phoneNumber'), value: user.profile.phoneNumber, optional: true },
    { icon: MapPin, label: t('city'), value: user.profile.city, optional: true },
    { icon: MapPin, label: t('country'), value: user.profile.country, optional: true },
    { icon: Calendar, label: t('joinDate'), value: format(new Date(user.createdAt), 'PPP') },
    { icon: Calendar, label: t('lastLogin'), value: user.lastLoginAt ? format(new Date(user.lastLoginAt), 'PPP') : null, optional: true },
  ].filter(field => !field.optional || field.value);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/40 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl">{t('title')}</CardTitle>
                <Link href="/profile/edit">
                  <Button>{t('edit')}</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{t('emailVerified')}</span>
                <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                  {user.emailVerified ? t('emailVerified') : t('emailNotVerified')}
                </Badge>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">{t('personalInfo')}</h3>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {profileFields.map((field, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <field.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <dt className="text-sm font-medium text-muted-foreground">{field.label}</dt>
                        <dd className="mt-1 text-sm truncate">{field.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>

              {user.profile.bio && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('bio')}</h3>
                    <p className="text-sm whitespace-pre-wrap">{user.profile.bio}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
