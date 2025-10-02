import Link from 'next/link';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold text-primary">🌱 Ecomama</h1>
          <p className="text-muted-foreground">Únete a la comunidad</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crear cuenta</CardTitle>
            <CardDescription>Regístrate para comenzar</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
