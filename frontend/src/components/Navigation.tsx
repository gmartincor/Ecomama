'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n';
import { useAuth } from '@/lib/auth-context';
import { Button } from './ui';
import { NavLink } from './navigation/nav-link';
import { UserMenu } from './navigation/user-menu';
import { MobileMenu } from './navigation/mobile-menu';
import { ThemeToggle } from './theme-toggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const t = useTranslations('navigation');
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/marketplace', label: t('marketplace') },
    { href: '/events', label: t('events') },
    { href: '/forums', label: t('forums') },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <MobileMenu 
          isAuthenticated={isAuthenticated}
          navItems={navItems}
          user={user}
          onLogout={handleLogout}
          t={t}
        />

        <Link href="/" className="flex items-center gap-2 mr-8">
          <span className="text-2xl font-bold text-primary">🌱</span>
          <span className="font-heading text-xl font-bold">Ecomama</span>
        </Link>

        <div className="hidden md:flex md:gap-6">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthenticated && user ? (
            <UserMenu
              user={user}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              t={t}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  {t('login')}
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  {t('register')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
