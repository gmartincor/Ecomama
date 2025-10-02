# Ecomama - Plataforma de Agricultores y Consumidores

Plataforma multi-tenancy que conecta agricultores y consumidores en comunidades locales para la compra directa de productos ecológicos.

## Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Base de datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: NextAuth.js
- **Styling**: Tailwind CSS
- **Validaciones**: Zod
- **Package Manager**: pnpm

## Estructura del Proyecto

```
ecomama/
├── app/                    # Next.js App Router
├── components/             # Componentes compartidos
│   ├── ui/                # Componentes UI base
│   ├── layout/            # Componentes de layout
│   └── common/            # Componentes comunes
├── features/              # Módulos de funcionalidad
│   ├── auth/
│   ├── communities/
│   ├── memberships/
│   ├── profiles/
│   ├── listings/
│   ├── events/
│   └── admin/
├── lib/                   # Utilidades y configuraciones
│   ├── prisma/           # Cliente Prisma
│   ├── auth/             # Configuración NextAuth
│   ├── validations/      # Schemas Zod
│   └── utils/            # Funciones utilitarias
├── types/                 # Tipos TypeScript globales
└── prisma/               # Schema y migraciones
```

## Setup Inicial

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env.local` y configura las variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tu configuración de PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecomama?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secret-seguro-aqui"
```

### 3. Generar secret para NextAuth

```bash
openssl rand -base64 32
```

Copia el resultado en `NEXTAUTH_SECRET`

### 4. Configurar PostgreSQL

Asegúrate de tener PostgreSQL corriendo y crea la base de datos:

```bash
createdb ecomama
```

### 5. Ejecutar migraciones de Prisma

```bash
pnpm prisma migrate dev --name init
```

### 6. Generar cliente Prisma

```bash
pnpm prisma generate
```

### 7. Iniciar servidor de desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## Scripts Disponibles

```bash
pnpm dev          # Iniciar servidor de desarrollo
pnpm build        # Compilar para producción
pnpm start        # Iniciar servidor de producción
pnpm lint         # Ejecutar linter
pnpm format       # Formatear código con Prettier
```

## Prisma Commands

```bash
pnpm prisma studio           # Abrir Prisma Studio
pnpm prisma migrate dev      # Crear y aplicar migración
pnpm prisma generate         # Generar cliente Prisma
pnpm prisma db push          # Aplicar schema sin migración
```

## Arquitectura

### Principios de Desarrollo

- **SOLID**: Responsabilidad única, Open/Closed, etc.
- **KISS**: Keep It Simple, Stupid
- **DRY**: Don't Repeat Yourself
- **YAGNI**: You Aren't Gonna Need It

### Modularidad

Cada feature es auto-contenido con:
- Componentes UI específicos
- Hooks personalizados
- Services para lógica de negocio
- Types específicos

## Roles de Usuario

- **SUPERADMIN**: Control total, crea comunidades y asigna admins
- **ADMIN**: Administra su comunidad, aprueba miembros, publica eventos
- **USER**: Miembro de comunidad, crea ofertas/demandas, ve perfiles

## Fases de Desarrollo

- ✅ Fase 0: Fundaciones del proyecto
- 🔄 Fase 1: Sistema de autenticación (próximo)
- 📋 Fase 2: Comunidades con mapa
- 📋 Fase 3: Sistema de solicitudes
- 📋 Fase 4: Selector de comunidad
- 📋 Fase 5: Perfiles de usuario
- 📋 Fase 6: Dashboard de comunidad
- 📋 Fase 7: Eventos y tablón
- 📋 Fase 8: Ofertas y demandas
- 📋 Fase 9: Panel de administración
- 📋 Fase 10: Panel de superadmin
- 📋 Fase 11: PWA
- 📋 Fase 12: Refinamiento
- 📋 Fase 13: Deployment

## Contribución

Este proyecto sigue buenas prácticas de ingeniería de software. Por favor, asegúrate de:
- Escribir código limpio y autoexplicativo
- Seguir la estructura de carpetas establecida
- Validar con Zod en APIs
- Usar TypeScript correctamente
- NO añadir comentarios innecesarios en el código
