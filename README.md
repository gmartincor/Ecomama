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

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- PostgreSQL 14+

### Installation

1. Clone the repository:

```bash
git clone https://github.com/gmartincor/Ecomama.git
cd Ecomama
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and configure your database URL and other variables.

4. Set up the database:

```bash
# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed the database (optional)
pnpm db:seed
```

5. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel with Postgres database.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgmartincor%2FEcomama)

1. Click the button above
2. Add a Postgres database from the Storage tab
3. Configure environment variables (AUTH_SECRET)
4. Deploy!

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
