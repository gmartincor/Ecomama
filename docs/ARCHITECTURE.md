# Ecomama Platform - Architecture Documentation

## System Architecture Overview

Ecomama is built using a **decoupled frontend-backend architecture** with clean architecture principles and modular design.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Web App     │  │  Mobile PWA  │  │  Admin Panel │  │
│  │  (Next.js)   │  │  (Next.js)   │  │  (Next.js)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Nginx Reverse Proxy                    │
│              (Load Balancer, SSL Termination)            │
└─────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    API Gateway Layer                     │
│                  (Spring Boot Backend)                   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │   Auth     │ │ Marketplace│ │   Events   │          │
│  │  Module    │ │   Module   │ │   Module   │  ...     │
│  └────────────┘ └────────────┘ └────────────┘          │
└─────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │    Redis     │  │  File Storage│  │
│  │  (Primary DB)│  │   (Cache)    │  │   (S3/Local) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Clean Architecture Layers

Each module in the backend follows clean architecture:

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                      │
│         (Controllers, DTOs, Mappers, WebSockets)         │
└─────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                       │
│           (Use Cases, Application Services)              │
└─────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Domain Layer                          │
│      (Entities, Value Objects, Domain Services)          │
└─────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                     │
│    (Repositories, External APIs, Database, Messaging)    │
└─────────────────────────────────────────────────────────┘
```

## Module Structure

### Backend Modules

1. **Auth Module** - Authentication & Authorization
   - JWT token management
   - User registration/login
   - OAuth2 providers
   - Role-based access control

2. **Marketplace Module** - Listings & Offers
   - Listing CRUD
   - Geolocation (PostGIS)
   - Search & filtering
   - Image management

3. **Events Module** - Events & News
   - Event CRUD
   - Calendar integration
   - RSVP tracking
   - Comments

4. **Forums Module** - Community Groups
   - Group management
   - Topic discussions
   - Voting system
   - Moderation

5. **Chat Module** - Real-time Messaging
   - WebSocket communication
   - Message persistence
   - File sharing
   - Notifications

6. **Content Module** - Blogs & Education
   - Article management
   - Course creation
   - Rich text editing
   - Content versioning

7. **Payments Module** - Stripe Integration
   - Donation processing
   - Payment history
   - Receipt generation
   - Webhooks

8. **Notifications Module** - Multi-channel Notifications
   - Email notifications
   - In-app notifications
   - Push notifications (PWA)
   - Notification preferences

9. **Admin Module** - Platform Administration
   - User management
   - Content moderation
   - Analytics
   - Audit logging

10. **Shared Module** - Common Utilities
    - Common DTOs
    - Utilities
    - Base classes
    - Cross-cutting concerns

### Frontend Features

1. **Authentication**
   - Login/Register
   - Profile management
   - Password reset

2. **Marketplace**
   - Map view (Leaflet)
   - List view
   - Search & filters
   - Listing details

3. **Events**
   - Calendar view
   - Event map
   - RSVP functionality
   - Event comments

4. **Forums**
   - Group listing
   - Topic threads
   - Reply system
   - Voting

5. **Chat**
   - Inbox
   - Conversations
   - Real-time messaging
   - File sharing

6. **Content**
   - Blog listing
   - Article reader
   - Course viewer
   - Content editor

7. **Payments**
   - Donation form
   - Payment history
   - Receipt download

## Technology Stack Details

### Frontend Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + TanStack Query (React Query)
- **Forms**: react-hook-form + zod
- **Maps**: Leaflet + React-Leaflet
- **i18n**: next-intl
- **Real-time**: Socket.io-client
- **Rich Text**: TipTap or Lexical
- **PWA**: next-pwa
- **Testing**: Jest, React Testing Library, Playwright

### Backend Stack
- **Language**: Java 21
- **Framework**: Spring Boot 3.2+ (latest stable)
- **Build Tool**: Gradle 8+
- **Database**: PostgreSQL 16+ with PostGIS
- **ORM**: Spring Data JPA (Hibernate)
- **Security**: Spring Security + JWT
- **WebSocket**: Spring WebSocket + STOMP
- **Validation**: Jakarta Validation
- **Mapping**: MapStruct
- **API Docs**: SpringDoc OpenAPI
- **Testing**: JUnit 5, Mockito, Testcontainers

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **Cache**: Redis
- **File Storage**: AWS S3 or local storage
- **Email**: SendGrid or AWS SES
- **Payments**: Stripe
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack or CloudWatch
- **Error Tracking**: Sentry

## Data Model (High-Level)

### Core Entities

```
User
├── id: UUID
├── email: String
├── password: String (hashed)
├── role: Enum (FARMER, CONSUMER, ADMIN)
├── profile: Profile
└── createdAt: Timestamp

Listing (Marketplace)
├── id: UUID
├── userId: UUID
├── title: String
├── description: String
├── type: Enum (OFFER, DEMAND)
├── location: Point (PostGIS)
├── category: String
├── images: String[]
├── status: Enum (ACTIVE, EXPIRED, SOLD)
└── createdAt: Timestamp

Event
├── id: UUID
├── userId: UUID
├── title: String
├── description: String
├── location: Point (PostGIS)
├── startDate: Timestamp
├── endDate: Timestamp
├── category: String
└── rsvps: RSVP[]

Group (Forum)
├── id: UUID
├── name: String
├── description: String
├── privacy: Enum (PUBLIC, PRIVATE)
├── members: User[]
└── topics: Topic[]

Topic (Forum)
├── id: UUID
├── groupId: UUID
├── userId: UUID
├── title: String
├── content: String
├── posts: Post[]
└── createdAt: Timestamp

Conversation (Chat)
├── id: UUID
├── participants: User[]
├── messages: Message[]
└── createdAt: Timestamp

Message
├── id: UUID
├── conversationId: UUID
├── senderId: UUID
├── content: String
├── attachments: String[]
└── timestamp: Timestamp

Article (Content)
├── id: UUID
├── userId: UUID
├── title: String
├── content: String (rich text)
├── category: String
├── tags: String[]
└── publishedAt: Timestamp

Payment
├── id: UUID
├── userId: UUID
├── amount: Decimal
├── currency: String
├── stripePaymentId: String
├── status: Enum (PENDING, COMPLETED, FAILED)
└── createdAt: Timestamp
```

## API Design

### RESTful Endpoints

All APIs follow this pattern: `/api/v1/{module}/{resource}`

Example endpoints:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/marketplace/listings`
- `POST /api/v1/marketplace/listings`
- `GET /api/v1/marketplace/listings/{id}`
- `PUT /api/v1/marketplace/listings/{id}`
- `DELETE /api/v1/marketplace/listings/{id}`
- `GET /api/v1/events`
- `POST /api/v1/events`
- `POST /api/v1/events/{id}/rsvp`
- `GET /api/v1/forums/groups`
- `POST /api/v1/forums/groups/{id}/topics`
- `GET /api/v1/payments/donations`
- `POST /api/v1/payments/donate`

### WebSocket Endpoints
- `/ws/chat` - Real-time chat
- `/ws/notifications` - Real-time notifications

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": "2025-10-19T12:00:00Z"
}
```

Error response:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": { ... }
  },
  "timestamp": "2025-10-19T12:00:00Z"
}
```

## Security Architecture

### Authentication Flow
1. User submits credentials
2. Backend validates credentials
3. JWT token generated (access + refresh)
4. Token stored in httpOnly cookie
5. Client includes token in requests
6. Backend validates token on each request

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Admin-only endpoints protected

### Security Measures
- HTTPS only in production
- CORS configuration
- SQL injection prevention (Prepared Statements)
- XSS protection (Content Security Policy)
- CSRF protection
- Rate limiting
- Input validation
- Password hashing (BCrypt)

## Deployment Architecture

### Development Environment
```
Docker Compose:
├── frontend (Next.js dev server)
├── backend (Spring Boot)
├── postgres (with PostGIS)
├── redis
└── nginx
```

### Production Environment
```
Cloud Infrastructure (AWS/GCP/Azure):
├── Application Load Balancer
├── Auto-scaling Group (Frontend containers)
├── Auto-scaling Group (Backend containers)
├── RDS PostgreSQL (Multi-AZ)
├── ElastiCache Redis
├── S3 for file storage
├── CloudFront CDN
└── Route 53 DNS
```

## CI/CD Pipeline

### GitHub Actions Workflow

```
On Push/PR:
├── Lint & Format Check
├── Run Unit Tests
├── Run Integration Tests
├── Build Application
├── Security Scan
├── Build Docker Image
└── (Production) Deploy to Cloud

On Main Branch:
├── All above steps
├── E2E Tests
├── Performance Tests
└── Deploy to Staging

On Release Tag:
├── All above steps
└── Deploy to Production
```

## Monitoring & Observability

### Metrics to Track
- Request rate & latency
- Error rate
- Database query performance
- Cache hit rate
- WebSocket connections
- Memory & CPU usage
- Disk usage

### Logging Strategy
- Structured JSON logging
- Log levels: ERROR, WARN, INFO, DEBUG
- Correlation IDs for request tracing
- Centralized log aggregation

### Alerting
- High error rate
- High latency
- Database connection issues
- Disk space low
- Memory pressure

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (multiple instances)
- Load balancer distribution
- Session storage in Redis
- Database connection pooling

### Caching Strategy
- Redis for session data
- Cache frequent queries
- CDN for static assets
- Browser caching headers

### Database Optimization
- Proper indexing
- Query optimization
- Connection pooling
- Read replicas (future)
- Database sharding (future)

## Future Enhancements

### Phase 2 Features (Post-Launch)
- Mobile native apps (React Native)
- Advanced analytics dashboard
- Machine learning recommendations
- Multi-language support expansion
- Video content support
- Advanced search (Elasticsearch)
- GraphQL API
- Microservices migration

## Architecture Decision Records (ADRs)

### ADR-001: Clean Architecture
**Decision**: Use clean architecture pattern
**Rationale**: Separation of concerns, testability, maintainability
**Status**: Accepted

### ADR-002: Modular Monolith
**Decision**: Start with modular monolith, not microservices
**Rationale**: Simpler deployment, easier development, can evolve to microservices
**Status**: Accepted

### ADR-003: PostgreSQL with PostGIS
**Decision**: Use PostgreSQL with PostGIS extension
**Rationale**: Powerful geospatial queries, ACID compliance, JSON support
**Status**: Accepted

### ADR-004: JWT Authentication
**Decision**: Use JWT tokens for authentication
**Rationale**: Stateless, scalable, standard approach
**Status**: Accepted

### ADR-005: Next.js App Router
**Decision**: Use Next.js App Router (not Pages Router)
**Rationale**: Modern approach, better performance, React Server Components
**Status**: Accepted

## Conclusion

This architecture provides a solid foundation for the Ecomama platform, balancing simplicity with scalability, and maintainability with extensibility. The modular design allows for independent development and testing of features, while clean architecture ensures the codebase remains organized and maintainable as the platform grows.
