# Ecomama - Platform for Farmers and Consumers

A multi-tenancy platform that connects farmers and consumers in local communities for the direct purchase of organic products.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Package Manager**: pnpm
- **PWA**: Progressive Web App support

## Features

- 🌱 **Progressive Web App**: Installable on any device
- 🏘️ **Communities**: Local farmer-consumer communities
- 🌾 **Listings**: Direct product offers and demands
- 📅 **Events**: Community gatherings and markets
- 👥 **Memberships**: Community membership management
- 🔐 **Authentication**: Secure user authentication with roles
- 📱 **Responsive**: Mobile-first responsive design

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
│   ├── landing/          # Landing page components
│   ├── pwa/              # PWA functionality
│   └── admin/
├── lib/                   # Utilities and configurations
│   ├── prisma/           # Prisma client
│   ├── auth/             # NextAuth configuration
│   ├── validations/      # Zod schemas
│   └── utils/            # Utility functions
├── types/                 # Global TypeScript types
├── public/                # Static assets
│   ├── icons/            # PWA icons
│   ├── manifest.json     # PWA manifest
│   └── sw.js             # Service Worker
└── prisma/               # Schema and migrations
```

## PWA Installation

The app is installable as a Progressive Web App:

1. Visit the landing page
2. Click "Instalar App" button in the navigation
3. Confirm installation in your browser
4. App will be added to your home screen

To regenerate PWA icons:

```bash
pnpm pwa:icons
```
