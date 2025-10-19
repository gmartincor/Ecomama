# Ecomama Platform

> A multi-user platform connecting farmers and consumers for the direct purchase of organic products.

## 🌱 Project Overview

Ecomama is more than just a marketplace—it's a cultural movement dedicated to connecting organic farmers directly with conscious consumers. The platform provides a comprehensive ecosystem for sustainable food communities.

### Key Features

- **📍 Marketplace** - Geolocation-based announcement board with map and list views
- **📅 Events & News** - Community events with RSVP and discussion features
- **💬 Forums & Groups** - Topic-based community discussions
- **📚 Educational Content** - Blogs, articles, and training materials
- **💬 Real-time Chat** - Private messaging between users
- **💳 Donations** - Stripe-powered donation platform

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + Nominatim
- **i18n**: English & Spanish support
- **PWA**: Progressive Web App capabilities

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.5+
- **Database**: PostgreSQL with PostGIS
- **Cache**: Redis
- **Architecture**: Clean Architecture + Modular Design

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

```bash
make dev
```

**Access**: http://localhost:3000

## Development

```bash
make dev              # Start all services
make db               # Database only
make test             # Run tests
make clean            # Cleanup
```

## Structure

```
ecomama/
├── backend/          # Spring Boot API
├── frontend/         # Next.js app
├── infrastructure/   # Docker, Nginx
├── scripts/          # Build scripts
└── docs/             # Documentation
```

## Production Build

```bash
make build-all        # Build images
./scripts/build.sh frontend
./scripts/build.sh backend
```

Deploy frontend and backend independently with environment variables.

---

**Built with 🌱 for sustainable food communities**
