# Configuración de Variables de Entorno en Vercel

## Variables que necesitas configurar en Vercel:

Ve a: https://vercel.com/guillermos-projects-1bb50025/ecomama-mvp/settings/environment-variables

### Variables requeridas:

1. **DATABASE_URL** (Production, Preview, Development)
   ```
   postgresql://neondb_owner:npg_OsjRxnqFJ5S7@ep-solitary-bar-a4u404g2-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

2. **AUTH_SECRET** (Production, Preview, Development)
   ```
   RbBbg53XNn7AqaMj6Tf/lPkHjuc+lPyMCfyZK4wzNyQ=
   ```

3. **NEXTAUTH_URL** (Production)
   ```
   https://ecomama-mvp-guillermos-projects-1bb50025.vercel.app
   ```

4. **AUTH_TRUST_HOST** (Production, Preview, Development)
   ```
   true
   ```

## Pasos:

1. Ve al dashboard de Vercel: https://vercel.com/guillermos-projects-1bb50025/ecomama-mvp
2. Click en "Settings" → "Environment Variables"
3. Añade cada variable con los valores correspondientes
4. Selecciona los entornos: Production, Preview, Development
5. Guarda los cambios

## Nota Importante:

Para **Production**, NEXTAUTH_URL debe ser la URL de producción de Vercel.
Para **Preview** y **Development**, se puede omitir NEXTAUTH_URL ya que Next-Auth lo detectará automáticamente.
