# Superadmin Feature

This module handles all superadmin-related functionality for the Ecomama platform.

## Architecture

The superadmin feature follows a clean, modular architecture adhering to SOLID, DRY, KISS, and YAGNI principles.

### Structure

```
features/superadmin/
├── components/          # Reusable UI components
│   ├── data-table/     # Generic data table with search, filtering, and actions
│   ├── MetricCard.tsx  # Reusable metric display card
│   ├── MetricsGrid.tsx # Dashboard metrics grid
│   ├── SuperadminNav.tsx
│   └── UserSelector.tsx
├── config/             # Table configurations
│   ├── user-table-config.tsx
│   └── community-table-config.tsx
├── constants/          # Shared constants
│   └── metrics.ts
├── hooks/              # Custom React hooks
│   ├── useApiData.ts   # Generic API data fetching hook
│   ├── useStats.ts
│   ├── useUsers.ts
│   └── useCommunities.ts
├── services/           # Business logic and data access
│   └── superadminService.ts
├── types/              # TypeScript interfaces and types
│   └── index.ts
└── utils/              # Helper functions
    ├── formatters.ts   # Date and data formatting
    └── status-helpers.ts # Status badge variants
```

## Key Components

### DataTable
A generic, reusable table component that supports:
- Search and filtering
- Custom column definitions
- Dynamic actions per row
- Responsive mobile view
- Processing state management

### MetricsGrid
Dashboard metrics display using configurable metric cards.

### Hooks

#### useApiData
Generic hook for API data fetching with:
- Loading states
- Error handling
- Auto-fetch on mount
- Manual refetch capability

#### Specialized Hooks
- `useStats()` - Global platform statistics
- `useUsers()` - User management with CRUD operations
- `useCommunities()` - Community management with status updates

## Design Patterns

### Single Responsibility Principle (SRP)
- Each component has one clear purpose
- Services handle data access only
- Hooks manage state and side effects
- Utilities perform pure transformations

### DRY (Don't Repeat Yourself)
- Shared utilities for formatting and status mapping
- Generic DataTable replaces multiple table implementations
- Unified API data fetching hook

### KISS (Keep It Simple, Stupid)
- Simple, focused components
- Clear naming conventions
- Minimal abstractions

### YAGNI (You Aren't Gonna Need It)
- No speculative features
- Only necessary abstractions
- Clean, minimal codebase

## Usage Example

### Dashboard Page
```tsx
import { MetricsGrid } from "@/features/superadmin/components/MetricsGrid";
import { useStats } from "@/features/superadmin/hooks/useStats";

export default function Dashboard() {
  const { data: stats, isLoading, error } = useStats();
  
  if (isLoading) return <PageLoading />;
  if (error) return <PageError message={error} />;
  
  return <MetricsGrid stats={stats} />;
}
```

### Users Page
```tsx
import { DataTable } from "@/features/superadmin/components/data-table";
import { useUsers } from "@/features/superadmin/hooks/useUsers";
import { useUserTableConfig } from "@/features/superadmin/config/user-table-config";

export default function UsersPage() {
  const { users, updateUserStatus, toggleUserRole } = useUsers();
  const { columns, getActions } = useUserTableConfig(
    currentUserId,
    updateUserStatus,
    toggleUserRole
  );
  
  return (
    <DataTable
      data={users}
      columns={columns}
      actions={(user) => getActions(user)}
      searchable
      searchKeys={["name", "email"]}
      getItemKey={(user) => user.id}
    />
  );
}
```

## API Routes

All superadmin routes are protected with `requireSuperAdmin` authorization.

- `GET /api/superadmin/stats` - Global platform statistics
- `GET /api/superadmin/users` - List all users
- `PUT /api/superadmin/users/[id]` - Update user
- `GET /api/superadmin/users/selectable` - Users for selection
- `GET /api/superadmin/communities` - List all communities
- `PUT /api/superadmin/communities/[id]` - Update community

## Best Practices

1. **Component Composition**: Build larger components from smaller, reusable ones
2. **Type Safety**: Use TypeScript interfaces for all data structures
3. **Error Handling**: Handle loading and error states consistently
4. **Accessibility**: Use semantic HTML and proper ARIA labels
5. **Performance**: Memoize expensive computations, use proper React keys
6. **Maintainability**: Clear naming, organized file structure, no code duplication
