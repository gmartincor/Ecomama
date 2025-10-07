import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { InstallPWAButton } from '@/features/pwa';

export const LandingNav = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="text-3xl transition-transform group-hover:scale-110">
              🌱
            </span>
            <span className="text-xl md:text-2xl font-bold text-primary group-hover:opacity-80 transition-opacity">
              Ecomama
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3">
            <InstallPWAButton />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden xs:flex">
                Iniciar sesión
              </Button>
              <Button variant="ghost" size="sm" className="xs:hidden px-3">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
