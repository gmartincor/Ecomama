import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';

interface UserProfile {
  firstName?: string;
  lastName?: string;
}

interface UserMenuProps {
  user: {
    profile: UserProfile;
    email: string;
  };
  onNavigate: (path: string) => void;
  onLogout: () => void;
  t: (key: string) => string;
}

export function UserMenu({ user, onNavigate, onLogout, t }: UserMenuProps) {
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
