'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n';
import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/ui/Button';
import { format } from 'date-fns';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const { user } = useAuth();

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-8 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
                <Link href="/profile/edit">
                  <Button variant="primary">{t('edit')}</Button>
                </Link>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('personalInfo')}
                </h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">{t('firstName')}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.profile.firstName}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">{t('lastName')}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.profile.lastName}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">{t('email')}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">{t('emailVerified')}</dt>
                    <dd className="mt-1">
                      {user.emailVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {t('emailVerified')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {t('emailNotVerified')}
                        </span>
                      )}
                    </dd>
                  </div>

                  {user.profile.phoneNumber && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('phoneNumber')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.profile.phoneNumber}</dd>
                    </div>
                  )}

                  {user.profile.city && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('city')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.profile.city}</dd>
                    </div>
                  )}

                  {user.profile.country && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('country')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.profile.country}</dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm font-medium text-gray-500">{t('joinDate')}</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {format(new Date(user.createdAt), 'PPP')}
                    </dd>
                  </div>

                  {user.lastLoginAt && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">{t('lastLogin')}</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {format(new Date(user.lastLoginAt), 'PPP')}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {user.profile.bio && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-2">{t('bio')}</dt>
                  <dd className="text-sm text-gray-900 whitespace-pre-wrap">
                    {user.profile.bio}
                  </dd>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
