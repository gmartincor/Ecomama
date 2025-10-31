# GitHub Actions Workflows

## Estado Actual: Fase 1 - Desarrollo

### ✅ Workflows Activos (Desarrollo)

#### `pull-request.yml`
- **Trigger**: Pull requests a main/develop
- **Propósito**: Validar PRs antes de merge
- **Estado**: ✅ Activo y funcional

#### `integration.yml`
- **Trigger**: Llamado por otros workflows
- **Propósito**: Tests, lint, cobertura
- **Estado**: ✅ Activo y funcional

#### `security.yml`
- **Trigger**: Push, PR, schedule (martes 3 AM)
- **Propósito**: CodeQL, Trivy, análisis de dependencias
- **Estado**: ✅ Activo y funcional

#### `documentation.yml`
- **Trigger**: Push a main, workflow_dispatch
- **Propósito**: Validar enlaces de documentación
- **Estado**: ✅ Activo y funcional

#### `dependency-updates.yml`
- **Trigger**: Schedule (lunes 2 AM), workflow_dispatch
- **Propósito**: Detectar actualizaciones de dependencias
- **Estado**: ✅ Activo y funcional

---

### ⏸️ Workflows Deshabilitados (Requieren Infraestructura)

#### `monitor.yml`
- **Trigger Original**: Cron cada 15 minutos
- **Trigger Actual**: Solo workflow_dispatch (manual)
- **Motivo**: Requiere servidores de staging/production
- **Habilitar en**: Fase 11 - Deployment
- **Requisitos**: 
  - Variable `DOMAIN` configurada
  - Servidores staging/production desplegados

#### `deploy-production.yml`
- **Trigger Original**: Push a main
- **Trigger Actual**: Solo workflow_dispatch (manual)
- **Motivo**: Requiere infraestructura de producción
- **Habilitar en**: Fase 11 - Deployment
- **Requisitos**:
  - Secrets: `PRODUCTION_API_URL`, `PRODUCTION_WS_URL`
  - Secrets: `SERVER_IP`, `SSH_PRIVATE_KEY`, `PRODUCTION_ENV`
  - Variable: `DOMAIN`
  - Servidor de producción configurado

#### `deploy-staging.yml`
- **Trigger Original**: Push a develop
- **Trigger Actual**: Solo workflow_dispatch (manual)
- **Motivo**: Requiere infraestructura de staging
- **Habilitar en**: Fase 11 - Deployment
- **Requisitos**:
  - Secrets: `STAGING_API_URL`, `STAGING_WS_URL`
  - Secrets: `SERVER_IP`, `SSH_PRIVATE_KEY`, `STAGING_ENV`
  - Variable: `DOMAIN`
  - Servidor de staging configurado

#### `cleanup.yml`
- **Trigger Original**: Schedule (domingo 4 AM)
- **Trigger Actual**: Solo workflow_dispatch (manual)
- **Motivo**: Limpieza de recursos no necesaria en desarrollo
- **Habilitar en**: Fase 11 - Deployment
- **Propósito**: Limpiar artifacts, caches e imágenes antiguas

#### `rollback.yml`
- **Trigger**: Solo workflow_dispatch (manual) - sin cambios
- **Motivo**: Solo para uso en producción cuando sea necesario
- **Habilitar en**: Fase 11 - Deployment
- **Requisitos**: Mismos que deployment

#### `build.yml`
- **Trigger**: Llamado por workflows de deployment
- **Estado**: Disponible pero no se ejecuta automáticamente
- **Propósito**: Construir imágenes Docker para deployment

#### `deploy.yml`
- **Trigger**: Llamado por workflows de deployment
- **Estado**: Disponible pero no se ejecuta automáticamente
- **Propósito**: Workflow reutilizable para deployment

---

## Cómo Reactivar Workflows de Deployment

Cuando llegues a la **Fase 11** del `IMPLEMENTATION_PLAN.md`:

### 1. Configurar Variables en GitHub

```bash
gh variable set DOMAIN --body "tudominio.com"
```

### 2. Configurar Secrets en GitHub

```bash
gh secret set PRODUCTION_API_URL --body "https://api.tudominio.com"
gh secret set PRODUCTION_WS_URL --body "wss://api.tudominio.com"
gh secret set STAGING_API_URL --body "https://api.staging.tudominio.com"
gh secret set STAGING_WS_URL --body "wss://api.staging.tudominio.com"
gh secret set SERVER_IP --body "tu.ip.del.servidor"
gh secret set SSH_PRIVATE_KEY --body "$(cat ~/.ssh/deploy_key)"
gh secret set PRODUCTION_ENV --body "$(cat .env.production)"
gh secret set STAGING_ENV --body "$(cat .env.staging)"
```

### 3. Reactivar Triggers Automáticos

En cada workflow deshabilitado, restaurar los triggers originales:

**monitor.yml**:
```yaml
on:
  schedule:
    - cron: '*/15 * * * *'
  workflow_dispatch:
```

**deploy-production.yml**:
```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

**deploy-staging.yml**:
```yaml
on:
  push:
    branches: [develop]
  workflow_dispatch:
```

**cleanup.yml**:
```yaml
on:
  schedule:
    - cron: '0 4 * * 0'
  workflow_dispatch:
```

---

## Troubleshooting

### "Context access might be invalid" warnings
- Normal en desarrollo
- Desaparecerán cuando configures las variables/secrets
- No afectan la ejecución de workflows activos

### ¿Por qué recibía correos cada 15 minutos?
- `monitor.yml` se ejecutaba automáticamente con cron
- Intentaba conectarse a servidores que no existen
- Ahora solo se ejecuta manualmente

### ¿Puedo probar un workflow deshabilitado?
- Sí, usa workflow_dispatch (ejecutar manualmente)
- Pero fallará si no tienes la infraestructura
- Útil para validar sintaxis antes del deployment

---

## Principios Aplicados

- **YAGNI**: Solo workflows necesarios para desarrollo actual
- **DRY**: Workflows reutilizables (`build.yml`, `deploy.yml`, `integration.yml`)
- **KISS**: Configuración simple, fácil de reactivar
- **Separation of Concerns**: CI/CD separado de deployment
