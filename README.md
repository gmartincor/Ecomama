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
make dev              # Start development (Docker)
make help             # See all commands
./verify-docker.sh    # Validate setup
```

**Access**: [Frontend](http://localhost:3000) • [API](http://localhost:8080/api/v1) • [Docs](http://localhost:8080/swagger-ui.html)

## Development

### Full Stack (Docker)
```bash
make dev              # Start all services
make dev-logs         # View logs
make dev-down         # Stop
```

### Database Only
```bash
make db               # Start postgres + redis
cd backend && ./gradlew bootRun
cd frontend && pnpm dev
```

### Testing
```bash
make test             # All tests
make test-backend     # Backend only
make test-frontend    # Frontend only
```

## Project Structure

```
ecomama/
├── backend/          # Spring Boot API
├── frontend/         # Next.js app
├── infrastructure/   # Docker, Nginx
├── docs/             # Documentation
└── .github/          # CI/CD
```

## Documentation

**[Docker Guide](./docs/DOCKER.md)** - Complete Docker setup  
**[Architecture](./docs/ARCHITECTURE.md)** - System design  
**[Quick Reference](./docs/DOCKER_QUICK_REF.md)** - Command cheatsheet

**Development**: [Copilot Instructions](./copilot-instructions.md) • [Implementation Plan](./IMPLEMENTATION_PLAN.md)

## Commands

```bash
make help             # Show all commands
make dev              # Development
make db               # Database only
make test             # Run tests
make clean            # Cleanup
```

See `make help` for complete list.

## 🎨 Code Quality & Design Patterns

The project follows industry best practices and proven design patterns:

### Principles
- **SOLID** - Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion
- **DRY** - Don't Repeat Yourself
- **KISS** - Keep It Simple, Stupid
- **YAGNI** - You Aren't Gonna Need It

### Architecture Patterns
- **Clean Architecture** - Domain-driven design with clear layer separation
- **Repository Pattern** - Data access abstraction
- **Service Layer** - Business logic encapsulation
- **DTO Pattern** - Data transfer objects for API contracts
- **Factory Pattern** - Object creation abstraction
- **Strategy Pattern** - Interchangeable algorithms
- **Observer Pattern** - Event-driven communication

### Development Practices
- **Test-Driven Development (TDD)** - Tests before implementation
- **Continuous Integration/Deployment** - Automated testing and deployment
- **Code Reviews** - Peer review process
- **Semantic Versioning** - Clear version management
- **Conventional Commits** - Standardized commit messages

---

**Built with 🌱 for sustainable food communities**
