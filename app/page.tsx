import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex w-full max-w-4xl flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-primary">🌱 Ecomama</h1>
          <p className="text-xl text-muted-foreground">
            Conectando agricultores y consumidores en comunidades locales
          </p>
        </div>

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Bienvenido a Ecomama</CardTitle>
            <CardDescription>
              Plataforma para la compra directa de productos ecológicos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">✅ Fase 0 Completada</h3>
              <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                <li>Next.js 14+ con App Router y TypeScript</li>
                <li>Prisma ORM con PostgreSQL configurado</li>
                <li>NextAuth.js para autenticación</li>
                <li>Tailwind CSS con sistema de diseño</li>
                <li>Componentes UI base implementados</li>
                <li>Validaciones con Zod</li>
                <li>Estructura modular feature-based</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="primary">Iniciar Sesión</Button>
              <Button variant="outline">Registrarse</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🏘️ Comunidades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Únete a comunidades locales de agricultores y consumidores
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🌾 Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Compra productos ecológicos directamente del agricultor
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🤝 Directo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sin intermediarios, precios justos para todos
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Stack: Next.js · TypeScript · Prisma · PostgreSQL · Tailwind CSS</p>
        </div>
      </main>
    </div>
  );
}

