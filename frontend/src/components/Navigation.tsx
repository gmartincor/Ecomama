'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n';
import { useAuth } from '@/lib/auth-context';
import Button from './ui/Button';
import Dropdown, { DropdownItem, DropdownDivider } from './ui/Dropdown';

export default function Navigation() {
  const t = useTranslations('navigation');
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">🌱 Ecomama</span>
            </Link>

            <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
              >
                {t('home')}
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-primary-600"
              >
                {t('marketplace')}
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-primary-600"
              >
                {t('events')}
              </Link>
              <Link
                href="/forums"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-primary-600"
              >
                {t('forums')}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <Dropdown
                trigger={
                  <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {user.profile.firstName?.[0]}{user.profile.lastName?.[0]}
                      </span>
                    </div>
                    <span className="hidden md:block">
                      {user.profile.firstName} {user.profile.lastName}
                    </span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                }
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.profile.firstName} {user.profile.lastName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <DropdownItem onClick={() => handleNavigate('/profile')}>
                  {t('profile')}
                </DropdownItem>
                <DropdownItem onClick={() => handleNavigate('/settings')}>
                  {t('settings')}
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={handleLogout} danger>
                  {t('logout')}
                </DropdownItem>
              </Dropdown>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    {t('register')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
