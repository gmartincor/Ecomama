'use client';

import { useState } from 'react';
import { Menu, LogOut, User, Settings } from 'lucide-react';
import { Link } from '@/i18n';
import { Button, Sheet, SheetContent, SheetTrigger, Separator } from '@/components/ui';
import { NavLink } from './nav-link';

interface UserProfile {
  firstName?: string;
  lastName?: string;
}

interface MobileMenuProps {
  isAuthenticated: boolean;
  navItems: Array<{ href: string; label: string }>;
  user?: {
    profile: UserProfile;
    email: string;
  } | null;
  onLogout: () => void;
  t: (key: string) => string;
}

export function MobileMenu({ isAuthenticated, navItems, user, onLogout, t }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  
  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  const fullName = user ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim() : '';

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <nav className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => (
            <NavLink 
              key={item.href} 
              href={item.href} 
              onClick={handleClose}
              className="text-lg"
            >
              {item.label}
            </NavLink>
          ))}
          
          <Separator className="my-2" />
          
          {isAuthenticated && user ? (
            <>
              <div className="px-2 py-2">
                <p className="text-sm font-medium">{fullName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              
              <Link href="/profile" onClick={handleClose}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  {t('profile')}
                </Button>
              </Link>
              
              <Link href="/settings" onClick={handleClose}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  {t('settings')}
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={handleClose}>
                <Button variant="ghost" className="w-full">
                  {t('login')}
                </Button>
              </Link>
              
              <Link href="/auth/register" onClick={handleClose}>
                <Button className="w-full">
                  {t('register')}
                </Button>
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
