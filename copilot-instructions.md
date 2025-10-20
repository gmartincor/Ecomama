````instructions
# Copilot Instructions for Ecomama Platform

## Project Overview

Ecomama is a multi-user platform connecting farmers and consumers for direct purchase of organic products. It's more than a marketplace—it's a cultural movement and community platform with web and mobile (PWA) support.

### Core Features
- **Marketplace**: Announcement board for offers/demands (chat-based transactions)
- **Geolocation**: Leaflet maps + Nominatim geocoding, dual view (map/list)
- **Events & News**: Calendar-based events with geolocation (Meetup-style)
- **Community Forums**: Reddit/Facebook Groups-style discussions
- **Real-time Chat**: Private messaging for marketplace negotiations
- **Educational Content**: Blog and training modules
- **Payments**: Donation system via Stripe
- **Admin Panel**: Moderation and analytics for superadmins

## Architecture Patterns

### Clean Architecture (Hexagonal/Ports & Adapters)
Each module follows a layered architecture with clear boundaries:

```
Module/
├── domain/           # Core business logic (entities, value objects, domain events)
│                     # Framework-independent, pure Java/TypeScript
├── application/      # Use cases, DTOs, application services
│                     # Orchestrates domain logic, defines ports (interfaces)
├── infrastructure/   # Adapters for external systems
│                     # Repositories, API clients, persistence, external services
└── presentation/     # Controllers, UI components, API handlers
                      # Adapts external requests to application layer
```

**Key Principles:**
- **Dependency Rule**: Dependencies point inward (Presentation → Application → Domain)
- **Domain Independence**: Business logic has zero framework dependencies
- **Interface Segregation**: Small, focused interfaces (ports)
- **Dependency Inversion**: Depend on abstractions, not implementations

### Modular Monolith Design
Organize code into self-contained domain modules with clear boundaries:

**Bounded Contexts:**
- `auth`: Identity & Access Management
- `marketplace`: Listings with geolocation (offers/demands)
- `events`: Calendar events with geolocation
- `community`: Forums, groups, discussions
- `chat`: Real-time messaging
- `content`: Educational blogs and training
- `payments`: Stripe donation integration
- `admin`: Moderation, analytics, user management
- `shared`: Cross-cutting concerns (utilities, common types)

**Module Communication:**
- Explicit interfaces/contracts between modules
- Event-driven for loose coupling (domain events)
- No direct repository access across modules
- Shared kernel for common domain concepts

**Benefits:**
- Single deployable unit (simpler ops)
- Strong module boundaries (enforced by package structure)
- Easy to understand and navigate
- Can evolve to microservices if needed

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

### Testing Strategy (Test Pyramid + TDD)

### Testing Pyramid (70/20/10 Rule)
```
         /\
        /E2E\        10% - End-to-End (Playwright)
       /------\           Critical user journeys
      /Integration\  20% - Integration Tests
     /------------\       External systems, APIs, DB
    /  Unit Tests  \  70% - Unit Tests (JUnit 5, Jest)
   /----------------\     Business logic, use cases
```

### Backend Testing
**Unit Tests (70%)** - Fast, isolated, abundant
- **Domain Layer**: Pure business logic, no mocks needed
- **Use Cases**: Mock repositories and external services
- **Framework**: JUnit 5 + Mockito + AssertJ
- **Coverage Goal**: 80%+ overall, 100% for critical paths

**Integration Tests (20%)** - Realistic, slower
- **Database**: Testcontainers (PostgreSQL with PostGIS)
- **API Endpoints**: MockMvc or WebTestClient
- **External Services**: Mock with WireMock or Testcontainers
- **Transactions**: Rollback after each test

**E2E Tests (10%)** - Full system, slowest
- **Framework**: Playwright (calling real backend)
- **Scenarios**: Critical user journeys only (login → create listing → chat)
- **Data**: Reset database before each test
- **Run**: CI/CD pipeline + nightly builds

### Frontend Testing
**Unit Tests (70%)** - Component logic
- **Framework**: Jest + React Testing Library
- **Focus**: Hooks, utilities, business logic
- **Mock**: API calls with MSW (Mock Service Worker)
- **User-centric**: Test behavior, not implementation

**Integration Tests (20%)** - Component integration
- **Framework**: Jest + React Testing Library
- **Focus**: Feature workflows (forms, multi-step processes)
- **Real State**: Use actual context providers
- **API**: Mock with MSW

**E2E Tests (10%)** - Full application
- **Framework**: Playwright
- **Scenarios**: Complete user flows (register → login → use feature)
- **Environment**: Against staging or local dev environment
- **Cross-browser**: Chrome, Firefox, Safari

### TDD Best Practices
1. **Test Behavior, Not Implementation**:
   - ❌ Bad: `expect(service.cache).toHaveBeenCalled()`
   - ✅ Good: `expect(response).toEqual(expectedData)`

2. **Given-When-Then Structure**:
   ```java
   @Test
   void shouldCreateListingWhenValidRequest() {
       // Given
       var request = new CreateListingRequest(...);
       
       // When
       var result = useCase.execute(request);
       
       // Then
       assertThat(result.isSuccess()).isTrue();
       assertThat(result.getValue().title()).isEqualTo("...");
   }
   ```

3. **One Assertion per Test** (when possible):
   - Each test should verify one behavior
   - Easier to understand failures

4. **Test Names Are Documentation**:
   - `should<Expected>When<Condition>` pattern
   - Example: `shouldReturnErrorWhenEmailAlreadyExists`

5. **Arrange-Act-Assert Pattern**:
   - **Arrange**: Set up test data
   - **Act**: Execute the code under test
   - **Assert**: Verify expectations

### Test Coverage Goals
- **Overall**: 80%+
- **Domain/Use Cases**: 100% (critical business logic)
- **Controllers/Repositories**: 70%+ (less critical, more integration)
- **UI Components**: 70%+ (behavior-focused)

### Continuous Testing
- **Pre-commit**: Run unit tests (fast feedback)
- **CI/CD**: Run all tests on every PR
- **Nightly**: Run E2E tests + performance tests
- **Coverage Reports**: Codecov integration, fail PR if coverage drops

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

### Frontend Structure (Feature-Sliced Design)
```
frontend/
├── src/
│   ├── app/              # Next.js App Router (routing only)
│   │   ├── [locale]/    # i18n routing (en, es)
│   │   └── api/         # API routes
│   ├── features/         # Feature modules (business logic)
│   │   ├── auth/
│   │   │   ├── api/      # API client functions
│   │   │   ├── components/  # Feature-specific components
│   │   │   ├── hooks/    # Feature-specific hooks
│   │   │   ├── types/    # TypeScript types
│   │   │   ├── utils/    # Feature utilities
│   │   │   └── context/  # Feature context providers
│   │   ├── marketplace/
│   │   ├── events/
│   │   ├── community/
│   │   ├── chat/
│   │   ├── content/
│   │   ├── payments/
│   │   └── admin/
│   ├── shared/           # Shared across features
│   │   ├── ui/          # Design system components (Button, Input, Card, etc.)
│   │   ├── lib/         # Utilities, helpers, constants
│   │   ├── hooks/       # Generic hooks (useDebounce, useLocalStorage, etc.)
│   │   ├── types/       # Global TypeScript types
│   │   └── api/         # Base API client, interceptors
│   ├── widgets/          # Composite components (Header, Footer, Sidebar)
│   ├── i18n/            # Internationalization config
│   ├── styles/          # Global styles, Tailwind config
│   └── middleware.ts    # Next.js middleware (auth, i18n)
└── public/              # Static assets (icons, images)
```

**Feature-Sliced Principles:**
- **Vertical slicing**: Features contain all their needs (API, components, hooks, types)
- **Low coupling**: Features don't import from each other
- **Shared kernel**: Common code in `shared/`
- **Clear boundaries**: Easy to understand feature scope

### Backend Structure (Modular Monolith)
```
backend/
├── src/main/java/com/ecomama/
│   ├── auth/             # Authentication & Authorization
│   │   ├── domain/
│   │   │   ├── model/    # User, Role entities
│   │   │   ├── repository/  # Port interfaces
│   │   │   └── service/  # Domain services (PasswordService)
│   │   ├── application/
│   │   │   ├── dto/      # Request/Response records
│   │   │   ├── usecase/  # Use case implementations
│   │   │   └── mapper/   # MapStruct mappers
│   │   ├── infrastructure/
│   │   │   ├── persistence/  # JPA repositories
│   │   │   ├── security/     # JWT, Spring Security config
│   │   │   └── email/        # Email service
│   │   └── presentation/
│   │       └── controller/   # REST controllers
│   ├── marketplace/      # Listings with geolocation
│   │   ├── domain/
│   │   │   ├── model/    # Listing, Category, Location
│   │   │   ├── repository/
│   │   │   └── service/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   │   ├── persistence/  # PostGIS repositories
│   │   │   └── storage/      # Image storage (S3/local)
│   │   └── presentation/
│   ├── events/           # Calendar events
│   ├── community/        # Forums and groups
│   ├── chat/             # Real-time messaging
│   │   └── infrastructure/
│   │       └── websocket/    # WebSocket handlers
│   ├── content/          # Educational content
│   ├── payments/         # Stripe integration
│   │   └── infrastructure/
│   │       └── stripe/       # Stripe SDK adapter
│   ├── admin/            # Admin panel
│   └── shared/           # Shared kernel
│       ├── domain/       # Common value objects
│       ├── exception/    # Global exception handling
│       ├── config/       # Spring configuration
│       └── util/         # Utilities
└── src/test/             # Tests mirror main structure
    ├── unit/             # Unit tests (70%)
    ├── integration/      # Integration tests (20%)
    └── e2e/              # End-to-end tests (10%)
```

**Package Structure Rules:**
- Module packages are **sealed** conceptually (no circular dependencies)
- Cross-module communication through:
  1. **Application services** (use case orchestration)
  2. **Domain events** (asynchronous decoupling)
  3. **Shared kernel** (common domain concepts)
- Infrastructure layer adapts external systems (database, APIs, messaging)

## Development Guidelines

### TDD Workflow (Test-Driven Development)
Follow the **Red-Green-Refactor** cycle religiously:

1. **🔴 RED**: Write a failing test first
   - Define expected behavior
   - Test should fail (no implementation yet)
   - Validates test is actually testing something

2. **🟢 GREEN**: Write minimal code to pass the test
   - Focus on making the test pass, not perfection
   - Simplest solution that works
   - Don't worry about code quality yet

3. **🔵 REFACTOR**: Improve code quality
   - Apply SOLID principles
   - Remove duplication (DRY)
   - Improve naming and structure
   - Tests still pass (green)

**Benefits:**
- High test coverage by design (80%+)
- Better API design (test-first reveals awkward APIs)
- Living documentation (tests describe behavior)
- Confidence to refactor

### When Creating New Features
1. **Domain Modeling** (Outside-In):
   - Identify entities, value objects, aggregates
   - Define domain events and invariants
   - Create domain models (no framework dependencies)

2. **Write Tests First** (TDD):
   - Start with acceptance test (E2E or integration)
   - Write use case unit tests
   - Test domain logic in isolation

3. **Implement Layers** (Inside-Out):
   - Domain layer (entities, value objects)
   - Application layer (use cases, DTOs)
   - Infrastructure layer (repositories, adapters)
   - Presentation layer (controllers, UI components)

4. **Integration**:
   - Wire up dependencies (Spring DI, React Context)
   - Integration tests with Testcontainers
   - E2E tests with Playwright

5. **Documentation & i18n**:
   - Update OpenAPI/Swagger docs
   - Add translation keys (EN + ES)
   - Update architecture docs if needed

### When Modifying Code
1. **Understand Context**:
   - Read existing tests to understand behavior
   - Identify affected modules and boundaries
   - Check for potential side effects

2. **Update Tests First**:
   - Modify tests to reflect new behavior
   - Ensure tests fail (Red)
   - Proceed with implementation

3. **Refactor Aggressively**:
   - If violating SOLID/DRY/KISS, refactor first
   - Extract methods/classes for clarity
   - Remove dead code and unused imports
   - Apply Boy Scout Rule: Leave code better than you found it

4. **Verify Quality**:
   - All tests pass (Green)
   - No regression in existing functionality
   - Code coverage maintained or improved

5. **Update Documentation**:
   - Update comments if behavior changed
   - Update API docs if signatures changed
   - Update README or architecture docs if needed

### Code Review Checklist
Before submitting a PR, ensure:

**Architecture & Design:**
- [ ] Follows Clean Architecture (correct layer dependencies)
- [ ] Module boundaries respected (no cross-module repository access)
- [ ] SOLID principles applied (SRP, OCP, LSP, ISP, DIP)
- [ ] DRY: No code duplication (extract common logic)
- [ ] KISS: Simple, understandable solution
- [ ] YAGNI: No premature optimization or unused features

**Testing:**
- [ ] TDD applied (tests written first)
- [ ] Unit test coverage ≥ 80%
- [ ] Integration tests for external systems
- [ ] E2E tests for critical user journeys
- [ ] Tests are readable and maintainable
- [ ] No flaky tests (deterministic)

**Code Quality:**
- [ ] Proper error handling (no swallowed exceptions)
- [ ] Input validation (DTOs, Zod schemas)
- [ ] Logging at appropriate levels (ERROR, WARN, INFO)
- [ ] No magic numbers or hardcoded strings
- [ ] Clear, descriptive variable/method names
- [ ] Functions are small and focused (<20 lines)

**Security:**
- [ ] No secrets in code (use environment variables)
- [ ] Input sanitization (prevent XSS, SQL injection)
- [ ] Authorization checks (RBAC enforced)
- [ ] Secure password handling (BCrypt)
- [ ] HTTPS only for sensitive operations

**Internationalization:**
- [ ] All user-facing text uses i18n keys
- [ ] Translation keys added for EN and ES
- [ ] Date/time formatted with locale
- [ ] Numbers/currency formatted correctly

**Performance:**
- [ ] Database queries optimized (indexes, N+1 prevention)
- [ ] No blocking operations in hot paths
- [ ] Appropriate caching strategy
- [ ] Images optimized (Next.js Image component)

**Documentation:**
- [ ] API endpoints documented (OpenAPI)
- [ ] Complex logic has explanatory comments
- [ ] README updated if setup changed
- [ ] Architecture diagrams updated if structure changed

**Continuous Improvement:**
- [ ] Dead code removed
- [ ] Deprecated dependencies updated
- [ ] Technical debt addressed (not accumulated)
- [ ] Refactoring opportunities identified

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
