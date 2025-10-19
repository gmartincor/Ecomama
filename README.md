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

First time setup:
```bash
make setup
make dev
```

**Access**: http://localhost:3000

## Development

```bash
make dev              # Start development environment
make dev-build        # Rebuild and start
make logs             # View logs
make db-connect       # Connect to database
make clean            # Stop and cleanup
```

## Production

```bash
make prod-build       # Build all production images
make prod             # Deploy all services with Nginx
make prod-backend     # Deploy backend only
make prod-frontend    # Deploy frontend only
```

## Project Structure

```
ecomama/
├── backend/          # Spring Boot 3 + Java 21
├── frontend/         # Next.js 14 + TypeScript
├── infrastructure/   # Docker, Nginx, init scripts
├── docs/             # Architecture & guides
├── docker-compose.*.yml
└── Makefile          # All commands
```

## Environment Configuration

- `.env.example` - Template with all variables
- `.env.dev` - Development (auto-created by setup)
- `.env.prod` - Production (configure before deployment)

---

**Built with 🌱 for sustainable food communities**
