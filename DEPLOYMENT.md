# Guía de Despliegue en Vercel

## Configuración MCP de Vercel en VS Code

### Paso 1: Añadir el Servidor MCP
1. Abre el Command Palette (`Cmd+Shift+P`)
2. Ejecuta: **"MCP: Add Server"**
3. Selecciona: **"HTTP"**
4. Configura:
   - URL: `https://mcp.vercel.com`
   - Name: `Vercel`
5. Elige: **"Global"** o **"Workspace"**

### Paso 2: Autorizar la Conexión
1. Command Palette → **"MCP: List Servers"**
2. Selecciona: **"Vercel"** → **"Start Server"**
3. Haz clic en **"Allow"** cuando pida autenticación
4. Si aparece popup de sitio web externo → **"Cancel"**
5. Cuando pregunte por URL Handler → **"Yes"**
6. Haz clic en **"Open"** y completa el login de Vercel

---

## Configuración de la Base de Datos en Vercel

### Opción 1: Usando el Dashboard de Vercel (Recomendado)

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Navega a tu proyecto (o créalo importando desde GitHub)
3. Ve a la pestaña **"Storage"**
4. Haz clic en **"Create Database"**
5. Selecciona **"Postgres"** (Vercel Postgres)
6. Nombre de la base de datos: `ecomama-db`
7. Región: `Washington, D.C., USA (iad1)` (para mejor rendimiento)
8. Haz clic en **"Create"**

**Importante**: Vercel Postgres en el plan Hobby incluye:
- 256 MB de almacenamiento
- 60 horas de compute por mes
- Conexiones ilimitadas
- Totalmente gratuito

### Opción 2: Usando el MCP de Vercel desde VS Code

Una vez configurado el MCP, puedes preguntarme directamente:
- "Crea una base de datos Postgres para mi proyecto ecomama"
- "Configura las variables de entorno para la base de datos"

---

## Variables de Entorno en Vercel

### Configurar en el Dashboard:

1. En tu proyecto de Vercel → **"Settings"** → **"Environment Variables"**
2. Añade las siguientes variables:

#### DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: Se autocompletará cuando conectes Vercel Postgres
- **Environment**: Production, Preview, Development

#### AUTH_SECRET
- **Key**: `AUTH_SECRET`
- **Value**: Genera uno con: `openssl rand -base64 32`
- **Environment**: Production, Preview, Development

#### NEXTAUTH_URL (Opcional en Vercel)
- Vercel lo detecta automáticamente, pero puedes configurarlo manualmente si lo necesitas

---

## Desplegar la Aplicación

### Opción 1: Desde GitHub (Recomendado)

1. Asegúrate de que tu código esté en GitHub
2. Ve a [vercel.com/new](https://vercel.com/new)
3. Importa tu repositorio: `gmartincor/Ecomama`
4. Configura el proyecto:
   - Framework Preset: **Next.js** (se detecta automáticamente)
   - Root Directory: `./`
   - Build Command: `pnpm run vercel-build` (se usa automáticamente)
   - Output Directory: `.next` (se detecta automáticamente)
5. Haz clic en **"Deploy"**

### Opción 2: Usando Vercel CLI

```bash
# Instalar Vercel CLI globalmente
pnpm add -g vercel

# Login en Vercel
vercel login

# Deploy (primera vez)
vercel

# Deploy a producción
vercel --prod
```

### Opción 3: Usando el MCP de Vercel desde Copilot

Una vez configurado el MCP, puedes pedirme:
- "Despliega la aplicación en Vercel"
- "Crea un nuevo proyecto en Vercel y despliega"

---

## Ejecutar Migraciones en Vercel

Las migraciones se ejecutan automáticamente durante el build gracias al script `vercel-build`:

```json
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

**¿Qué hace este comando?**
1. `prisma generate` → Genera el Prisma Client
2. `prisma migrate deploy` → Aplica las migraciones pendientes
3. `next build` → Construye la aplicación Next.js

---

## Post-Despliegue

### 1. Conectar la Base de Datos al Proyecto

Si creaste la base de datos desde el Storage tab:
1. Ve a **"Storage"** → Tu base de datos
2. Haz clic en **"Connect Project"**
3. Selecciona tu proyecto: `ecomama`
4. Las variables de entorno se añadirán automáticamente

### 2. Verificar el Despliegue

1. Ve a **"Deployments"** en tu proyecto
2. Haz clic en el último deployment
3. Verifica los logs de build
4. Abre la URL de producción para probar

### 3. Ejecutar Seed (Opcional)

Si necesitas poblar la base de datos con datos iniciales:

```bash
# Conectarse a la base de datos de producción temporalmente
# (Copia DATABASE_URL desde Vercel Dashboard → Settings → Environment Variables)

# Ejecutar seed
DATABASE_URL="postgresql://..." pnpm run db:seed
```

**Nota**: Ten cuidado al ejecutar seeds en producción. Es mejor hacerlo solo en desarrollo.

---

## Monitoreo y Mantenimiento

### Ver Logs
- Dashboard de Vercel → Tu proyecto → **"Deployments"** → Click en deployment → **"Logs"**

### Base de Datos
- Dashboard de Vercel → **"Storage"** → Tu base de datos
- Aquí puedes ver:
  - Uso de almacenamiento
  - Conexiones activas
  - Métricas de rendimiento

### Re-desplegar
- Cada push a la rama `main` desplegará automáticamente
- Para re-desplegar manualmente: Dashboard → **"Deployments"** → **"..."** → **"Redeploy"**

---

## Solución de Problemas Comunes

### Error: "DATABASE_URL is not defined"
- Verifica que la variable esté configurada en Settings → Environment Variables
- Asegúrate de que la base de datos esté conectada al proyecto

### Error de Migraciones
- Verifica los logs de build
- Puede que necesites ejecutar `prisma migrate deploy` manualmente

### Error de Build
- Verifica que todas las dependencias estén en `dependencies` (no en `devDependencies`)
- Revisa los logs de build para más detalles

---

## Límites del Plan Hobby (Gratuito)

### Vercel
- 100 GB de bandwidth por mes
- 6,000 minutos de build por mes
- Dominios personalizados ilimitados
- SSL automático

### Vercel Postgres
- 256 MB de almacenamiento
- 60 horas de compute por mes
- 256 MB de RAM por consulta
- Conexiones ilimitadas

**Para la mayoría de MVPs y proyectos pequeños, esto es más que suficiente.**

---

## Próximos Pasos

Una vez desplegado:
1. ✅ Configura un dominio personalizado (opcional)
2. ✅ Añade variables de entorno de producción
3. ✅ Configura GitHub para CI/CD automático
4. ✅ Monitorea el uso de recursos
5. ✅ Considera configurar Vercel Analytics (gratuito en Hobby)

---

## Recursos Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Prisma con Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
