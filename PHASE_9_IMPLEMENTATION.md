# Fase 9: Panel de Administración de Comunidad

## Resumen

Panel completo para que los administradores de comunidad puedan gestionar todos los aspectos de su comunidad: estadísticas, miembros y configuración.

## Arquitectura Implementada

### 1. Tipos (`/features/admin/types/index.ts`)

- **CommunityStats**: Estadísticas de la comunidad (6 métricas)
  - `membersCount`: Total de miembros activos
  - `pendingRequestsCount`: Solicitudes pendientes de aprobación
  - `offersCount`: Ofertas activas
  - `demandsCount`: Demandas activas
  - `activeListingsCount`: Total de publicaciones activas
  - `eventsCount`: Eventos creados

- **UpdateCommunityData**: Datos para actualizar perfil de comunidad
  - Campos: name, description, address, city, country, latitude, longitude

- **AdminMember**: Información de miembros con estadísticas
  - Datos del usuario + contadores de actividad (listings, events)

### 2. Validaciones (`/lib/validations/adminValidation.ts`)

Schemas Zod para validar datos:
- `updateCommunitySchema`: Validación de datos de comunidad
- `removeMemberSchema`: Validación para remover miembros
- `updateMemberRoleSchema`: Validación para cambiar roles

### 3. Capa de Servicios (`/features/admin/services/adminService.ts`)

5 funciones principales:

#### `getCommunityStats(communityId: string)`
Obtiene estadísticas agregadas usando Prisma `groupBy`.

#### `getAdminMembers(communityId: string)`
Lista miembros con contadores de actividad (listings, eventos).

#### `updateCommunity(communityId: string, data: UpdateCommunityData)`
Actualiza información de la comunidad.

#### `removeMember(communityId: string, userId: string)`
Marca miembro como REMOVED (soft delete).

#### `isUserCommunityAdmin(userId: string, communityId: string)`
Valida si el usuario es administrador de la comunidad.

### 4. Componentes (`/features/admin/components/`)

#### `CommunityStats.tsx`
Dashboard visual con 6 tarjetas de estadísticas:
- Cada tarjeta es clickeable (navegación)
- Indicador visual para solicitudes pendientes
- Props opcionales para handlers de navegación

#### `MemberManagementTable.tsx`
Tabla completa de gestión de miembros:
- Búsqueda por nombre/email
- Avatar y datos de perfil
- Contadores de actividad
- Botón de remover (deshabilitado para usuario actual)
- Click en perfil para navegar

#### `CommunityEditForm.tsx`
Formulario de edición de comunidad:
- Todos los campos editables
- Validación con Zod
- Estados de carga y error
- Botones de guardar/cancelar

#### `AdminNav.tsx`
Navegación lateral del panel admin:
- Links a Dashboard, Miembros, Configuración
- Resalta página activa
- Iconos visuales

### 5. Hooks (`/features/admin/hooks/`)

#### `useAdminStats(communityId: string)`
Hook para obtener estadísticas:
```typescript
const { stats, isLoading, error, refetch } = useAdminStats(communityId);
```

#### `useAdminMembers(communityId: string)`
Hook para gestión de miembros:
```typescript
const { members, isLoading, error, removeMember } = useAdminMembers(communityId);
```

#### `useAdminCommunity(communityId: string)`
Hook para actualizar comunidad:
```typescript
const { updateCommunity } = useAdminCommunity(communityId);
```

### 6. API Routes (`/app/api/admin/community/[id]/`)

Todas las rutas implementan el mismo patrón de seguridad:

#### Patrón de Autenticación
```typescript
const session = await auth();
if (!session?.user?.id) return 401;

const { id } = await params;
const isAdmin = await adminService.isUserCommunityAdmin(session.user.id, id);
if (!isAdmin) return 403;
```

#### `GET /stats/route.ts`
Retorna estadísticas de la comunidad.

#### `GET /members/route.ts`
Lista todos los miembros con estadísticas.

#### `DELETE /members/[userId]/route.ts`
Remueve un miembro (con validación de no auto-remoción).

#### `PUT /profile/route.ts`
Actualiza perfil de comunidad (con validación Zod).

### 7. Páginas Admin (`/app/admin/community/[id]/`)

#### `layout.tsx`
Layout compartido con:
- Navegación lateral (AdminNav)
- Grid responsive (sidebar + contenido)

#### `dashboard/page.tsx`
Vista general con:
- Estadísticas visuales
- Navegación a otras secciones desde las tarjetas

#### `members/page.tsx`
Gestión de miembros:
- Tabla con búsqueda
- Funcionalidad de remover miembros
- Usa sesión para prevenir auto-remoción

#### `settings/page.tsx`
Configuración de comunidad:
- Formulario de edición
- Carga datos actuales
- Redirección post-actualización

## Seguridad

1. **Autenticación**: Todas las rutas requieren sesión activa
2. **Autorización**: Validación de rol de admin para la comunidad específica
3. **Validación**: Schemas Zod en API routes
4. **Protección**: No se puede remover a uno mismo
5. **Soft Delete**: Los miembros removidos mantienen datos históricos

## Flujo de Usuario

1. Admin accede a `/admin/community/{id}/dashboard`
2. Ve estadísticas de su comunidad
3. Puede navegar a:
   - **Miembros**: Ver lista, buscar, remover miembros
   - **Configuración**: Editar nombre, descripción, ubicación
   - **Solicitudes pendientes**: Click en tarjeta redirige a gestión
4. Todas las acciones validan permisos de admin

## Principios Aplicados

- **SOLID**: Responsabilidad única en servicios, componentes y hooks
- **DRY**: Servicios reutilizables, patrón auth consistente
- **KISS**: Componentes simples y focalizados
- **YAGNI**: Solo funcionalidad requerida, sin código extra
- **Sin comentarios**: Código auto-explicativo

## Integración con Fases Anteriores

- Usa componentes UI de la fase base
- Integra con sistema de autenticación existente
- Conecta con Prisma schema (Community, User, CommunityMember)
- Sigue estructura de carpetas establecida

## Próximos Pasos

Esta fase completa el panel de administración de comunidad. La siguiente fase (Fase 10) implementará el panel de superadmin con capacidades adicionales de gestión global.
