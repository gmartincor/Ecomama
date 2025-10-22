'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n';
import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors hover:text-primary',
        active ? 'text-foreground' : 'text-muted-foreground'
      )}
    >
      {children}
    </Link>
  );
}

interface UserMenuProps {
  user: {
    profile: {
      firstName?: string;
      lastName?: string;
    };
    email: string;
  };
  onNavigate: (path: string) => void;
  onLogout: () => void;
  t: (key: string) => string;
}

function UserMenu({ user, onNavigate, onLogout, t }: UserMenuProps) {
  const initials = `${user.profile.firstName?.[0] || ''}${user.profile.lastName?.[0] || ''}`;
  const fullName = `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:block text-sm font-medium">
            {fullName}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onNavigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>{t('profile')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onNavigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>{t('settings')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <div className="flex gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">🌱</span>
            <span className="font-heading text-xl font-bold">Ecomama</span>
          </Link>

          <div className="hidden md:flex md:gap-6">
            <NavLink href="/">{t('home')}</NavLink>
            <NavLink href="/marketplace">{t('marketplace')}</NavLink>
            <NavLink href="/events">{t('events')}</NavLink>
            <NavLink href="/forums">{t('forums')}</NavLink>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {isAuthenticated && user ? (
            <UserMenu
              user={user}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              t={t}
            />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
