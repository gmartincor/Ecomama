import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="container mx-auto p-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">
            ¡Hola, {session.user.name}!
          </h1>
          <p className="text-muted-foreground">
            Bienvenido a tu panel de Ecomama
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Mi Perfil</CardTitle>
              <CardDescription>
                Gestiona tu información personal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Email:</span> {session.user.email}
                </div>
                <div>
                  <span className="font-medium">Rol:</span> {session.user.role}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comunidades</CardTitle>
              <CardDescription>
                Explora y únete a comunidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aún no perteneces a ninguna comunidad
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ofertas y Demandas</CardTitle>
              <CardDescription>
                Publica productos o búsquedas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Únete a una comunidad para empezar
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>✅ Sistema de Autenticación Completado</CardTitle>
              <CardDescription>Fase 1 finalizada exitosamente</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                <li>Registro de usuarios funcional</li>
                <li>Login con NextAuth.js implementado</li>
                <li>Middleware de protección de rutas activo</li>
                <li>Hook useAuth personalizado creado</li>
                <li>Layout con header y logout funcional</li>
                <li>Páginas protegidas configuradas</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
