import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold text-primary">🌱 Ecomama</h1>
          <p className="text-muted-foreground">Bienvenido de vuelta</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar sesión</CardTitle>
            <CardDescription>Accede a tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
