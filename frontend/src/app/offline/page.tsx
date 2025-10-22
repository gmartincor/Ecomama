import Link from 'next/link';
import { RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function OfflinePage() {
  const content = {
    en: {
      title: "You're Offline",
      description: "Please check your internet connection and try again.",
      tryAgain: "Try Again",
      goHome: "Go Home"
    },
    es: {
      title: "Estás sin conexión",
      description: "Por favor verifica tu conexión a internet e intenta de nuevo.",
      tryAgain: "Reintentar",
      goHome: "Ir al Inicio"
    }
  };

  const locale = typeof window !== 'undefined' ? localStorage.getItem('locale') || 'en' : 'en';
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <WifiOff className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl">{t.title}</CardTitle>
            <CardDescription className="text-base">{t.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => window.location.reload()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              {t.tryAgain}
            </Button>
            <Button asChild variant="outline">
              <Link href="/">{t.goHome}</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            🌱 Ecomama - Your Sustainable Living Community
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function generateMetadata() {
  return { 
    title: "You're Offline - Ecomama", 
    description: "No internet connection. Please check your network." 
  };
}
