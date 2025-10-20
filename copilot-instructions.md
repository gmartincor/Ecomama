# Copilot Instructions for Ecomama Platform

## Project Overview

Ecomama is a multi-user platform connecting farmers and consumers for direct purchase of organic products. It's a cultural movement and marketplace with web and mobile (PWA) support.

## Architecture Patterns

### Clean Architecture
- **Domain Layer**: Core business logic, entities, and use cases
- **Application Layer**: Application-specific business rules
- **Infrastructure Layer**: External services, databases, frameworks
- **Presentation Layer**: UI components and API controllers

### Modular Design
- Organize code into self-contained modules (marketplace, events, forums, chat, payments, admin)
- Each module follows clean architecture principles
- Minimize coupling between modules

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **PWA**: Progressive Web App capabilities
- **Maps**: Leaflet + Nominatim for geolocation
- **i18n**: next-intl for internationalization (English/Spanish)
- **State Management**: React Context + React Query
- **Real-time**: Socket.io client for chat

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.5,6
- **Build Tool**: Gradle
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA
- **Authentication**: Spring Security + JWT
- **Real-time**: WebSocket for chat
- **Payments**: Stripe API
- **API Documentation**: OpenAPI/Swagger

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Testing**: JUnit 5, Mockito, Jest, React Testing Library

## Code Standards

### General Principles
- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DRY**: Don't Repeat Yourself - reuse code through abstractions
- **KISS**: Keep It Simple, Stupid - prefer simple solutions
- **YAGNI**: You Aren't Gonna Need It - avoid premature optimization

### Java/Spring Boot
- Use record types for DTOs (Java 21)
- Leverage pattern matching and sealed classes where appropriate
- Follow Spring Boot best practices:
  - Use constructor injection over field injection
  - Prefer `@RestController` for API endpoints
  - Use `@Service`, `@Repository` stereotypes appropriately
  - Implement global exception handling with `@ControllerAdvice`
- Package structure by feature/module, not by layer
- Use MapStruct for entity-DTO mapping
- Implement comprehensive logging with SLF4J

### TypeScript/Next.js
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Server Components by default, Client Components when needed
- Implement proper error boundaries
- Use next-intl for all user-facing text
- Follow Next.js App Router conventions
- Use Tailwind utility classes, avoid custom CSS when possible

### Testing Strategy (TDD)
- **Backend**: Unit tests (70%+), integration tests, E2E tests
  - Use JUnit 5 for unit tests
  - Testcontainers for integration tests
  - MockMvc for API testing
- **Frontend**: Component tests, integration tests, E2E tests
  - Jest + React Testing Library for unit/component tests
  - Playwright for E2E tests
- Write tests before implementation
- Aim for high coverage (80%+)

### Naming Conventions
- **Java**: 
  - Classes: PascalCase
  - Methods/variables: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Packages: lowercase
- **TypeScript**:
  - Components: PascalCase
  - Functions/variables: camelCase
  - Files: kebab-case
  - Types/Interfaces: PascalCase
- **Database**: snake_case for tables and columns

### Git Workflow
- **Branch naming**: `feature/`, `bugfix/`, `hotfix/`, `release/`
- **Commit messages**: Conventional Commits format
  - `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- **Pull Requests**: Require code review, passing CI/CD

## Project Structure

### Monorepo Layout
```
/
├── frontend/          # Next.js application
├── backend/           # Spring Boot application
├── infrastructure/    # Docker, Nginx configs
├── .github/           # GitHub Actions workflows
└── docs/              # Documentation
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Reusable components
│   ├── features/         # Feature-based modules
│   │   ├── marketplace/
│   │   ├── events/
│   │   ├── forums/
│   │   ├── chat/
│   │   ├── payments/
│   │   └── admin/
│   ├── lib/              # Utilities, hooks, types
│   ├── services/         # API clients
│   └── styles/           # Global styles
└── public/               # Static assets
```

### Backend Structure
```
backend/
├── src/main/java/com/ecomama/
│   ├── marketplace/      # Marketplace module
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── events/           # Events module
│   ├── forums/           # Forums module
│   ├── chat/             # Chat module
│   ├── payments/         # Payments module
│   ├── admin/            # Admin module
│   ├── auth/             # Authentication module
│   └── shared/           # Shared kernel
└── src/test/             # Tests mirror main structure
```

## Development Guidelines

### When Creating New Features
1. Start with domain models and use cases
2. Write tests first (TDD)
3. Implement application services
4. Create infrastructure adapters
5. Build presentation layer (API/UI)
6. Update documentation
7. Ensure i18n coverage

### When Modifying Code
1. Identify affected modules
2. Update tests first
3. Refactor if violating principles
4. Remove unused code
5. Update related documentation

### Code Review Checklist
- [ ] Follows SOLID, DRY, KISS, YAGNI
- [ ] Has comprehensive test coverage
- [ ] Implements proper error handling
- [ ] Includes i18n for user-facing text
- [ ] No code duplication
- [ ] Clean, maintainable, and scalable
- [ ] Follows naming conventions
- [ ] Properly documented

## API Design
- RESTful endpoints following OpenAPI specification
- Use proper HTTP methods and status codes
- Versioned APIs (`/api/v1/...`)
- Consistent response format:
  ```json
  {
    "success": true,
    "data": {},
    "error": null,
    "timestamp": "2025-10-19T..."
  }
  ```
- Implement pagination for list endpoints
- Use DTOs for request/response, never expose entities

## Security
- JWT-based authentication
- Role-based access control (RBAC) - Roles: FARMER, CONSUMER, ADMIN
- Input validation on all endpoints
- CORS configuration
- SQL injection prevention
- XSS protection
- HTTPS only in production
- Secure password hashing (BCrypt)
- Admin endpoints protected with ADMIN role

## Performance
- Database indexing on frequently queried fields
- Caching strategy (Redis for sessions/frequent data)
- Image optimization (Next.js Image component)
- Lazy loading for components and routes
- Connection pooling for database
- Rate limiting on APIs

## Monitoring & Logging
- Structured logging (JSON format)
- Log levels: ERROR, WARN, INFO, DEBUG
- Track key metrics (response times, error rates)
- Health check endpoints
- Correlation IDs for request tracing

## Internationalization (i18n)
- All user-facing text in translation files
- Language detection from browser/user preference
- Date/time formatting per locale
- Number/currency formatting
- RTL support considerations (future)

## Accessibility
- WCAG 2.1 AA compliance
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratios
- Screen reader compatibility

## Documentation
- Code comments for complex logic only
- OpenAPI/Swagger for API documentation
- Component Storybook (optional)
- Architecture Decision Records (ADRs)
- Update documentation with code changes

## Environment Variables
- Never commit secrets
- Use `.env.local` for local development
- Document all required environment variables
- Use different configs for dev/staging/production

## Dependencies
- Keep dependencies up to date
- Review security vulnerabilities regularly
- Minimize dependency count
- Prefer well-maintained libraries

## Copilot Usage
- Use Copilot for boilerplate and repetitive code
- Review and refactor Copilot suggestions
- Ensure generated code follows project standards
- Write clear comments to guide Copilot
- Use Copilot Chat for architecture discussions
