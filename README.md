# Ecomama - Platform for Farmers and Consumers

A multi-tenancy platform that connects farmers and consumers in local communities for the direct purchase of organic products.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Package Manager**: pnpm

## Project Structure

```
ecomama/
├── app/                    # Next.js App Router
├── components/             # Shared components
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   └── common/            # Common components
├── features/              # Feature modules
│   ├── auth/
│   ├── communities/
│   ├── memberships/
│   ├── profiles/
│   ├── listings/
│   ├── events/
│   └── admin/
├── lib/                   # Utilities and configurations
│   ├── prisma/           # Prisma client
│   ├── auth/             # NextAuth configuration
│   ├── validations/      # Zod schemas
│   └── utils/            # Utility functions
├── types/                 # Global TypeScript types
└── prisma/               # Schema and migrations
```
