import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const LandingNav = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl transition-transform group-hover:scale-110">
              🌱
            </span>
            <span className="text-2xl font-bold text-primary group-hover:opacity-80 transition-opacity">
              Ecomama
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Iniciar sesión
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
