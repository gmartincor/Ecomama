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
- **Framework**: Spring Boot 3.2+
- **Database**: PostgreSQL with PostGIS
- **Cache**: Redis
- **Architecture**: Clean Architecture + Modular Design

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Java 21+
- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/ecomama.git
cd ecomama

# Run setup script
chmod +x setup.sh
./setup.sh

# Start frontend (in one terminal)
cd frontend
pnpm dev

# Start backend (in another terminal)
cd backend
./gradlew bootRun
```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 📖 Documentation

- [Implementation Plan](./IMPLEMENTATION_PLAN.md) - Phased development roadmap
- [Architecture](./docs/ARCHITECTURE.md) - System architecture documentation
- [Copilot Instructions](./copilot-instructions.md) - Development guidelines

## 🏗️ Project Structure

```
ecomama/
├── frontend/          # Next.js application
├── backend/           # Spring Boot application
├── infrastructure/    # Docker, Nginx configs
├── .github/           # GitHub Actions workflows
└── docs/              # Documentation
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
pnpm test              # Unit tests
pnpm test:e2e          # E2E tests

# Backend tests
cd backend
./gradlew test         # Unit & integration tests
```

## 🐳 Docker Deployment

```bash
# Start all services
docker-compose -f infrastructure/docker-compose.yml up -d

# View logs
docker-compose -f infrastructure/docker-compose.yml logs -f

# Stop all services
docker-compose -f infrastructure/docker-compose.yml down
```

## 🤝 Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes following [Copilot Instructions](./copilot-instructions.md)
3. Write tests (TDD approach)
4. Commit using conventional commits: `feat: add new feature`
5. Push and create a Pull Request
6. Wait for CI/CD checks to pass
7. Request code review

## 📋 Available Scripts

### Root
- `pnpm dev` - Start frontend in development mode
- `pnpm build` - Build frontend for production
- `pnpm docker:up` - Start all Docker services
- `pnpm docker:down` - Stop all Docker services

### Frontend
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm lint` - Lint code
- `pnpm format` - Format code

### Backend
- `./gradlew bootRun` - Start development server
- `./gradlew build` - Build application
- `./gradlew test` - Run tests
- `./gradlew clean` - Clean build artifacts

## 🔒 Security

- JWT-based authentication
- HTTPS only in production
- Input validation on all endpoints
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting

## 📊 Monitoring & Logging

- Health check endpoints
- Structured JSON logging
- Prometheus metrics
- Error tracking with Sentry (production)

## 🌍 Internationalization

The platform supports multiple languages:
- English (default)
- Spanish

## 🎨 Code Quality

The project follows:
- **SOLID** principles
- **DRY** - Don't Repeat Yourself
- **KISS** - Keep It Simple, Stupid
- **YAGNI** - You Aren't Gonna Need It
- Clean Architecture
- Test-Driven Development (TDD)

## 📝 License

[To be determined]

## 👥 Team

Ecomama Team - Building sustainable food communities

## 🙏 Acknowledgments

- OpenStreetMap & Nominatim for geolocation services
- All open-source contributors

---

**Made with 🌱 for a sustainable future**
