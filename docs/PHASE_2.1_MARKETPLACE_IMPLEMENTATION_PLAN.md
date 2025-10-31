# Phase 2.1: Marketplace Implementation - Detailed Plan

## 📋 Current Architecture Analysis

### ✅ Available Infrastructure
- **Backend**: Spring Boot 3.5.6 + Java 21 with Clean Architecture
- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, i18n (EN/ES)
- **Database**: PostgreSQL 16 with PostGIS enabled
- **Cache**: Redis configured
- **Docker**: Dev and production environments configured
- **Testing**: JUnit 5, Testcontainers, Jest, Playwright

### ✅ Reusable Existing Modules
- **Auth Module**: Complete JWT authentication system
- **Shared Module**: Exceptions, utilities, ApiResponse, base classes
- **Testing Infrastructure**: BaseTest, fixtures, assertions
- **Frontend Components**: Navigation, Layout, Theme, Forms, UI components

### 📊 Marketplace Overview

The marketplace will have TWO main views:

#### 1. OFFERS View
- Products/services offered by farmers/sellers
- Map view + list view
- Text search, filters by category, location
- Product cards with images, prices, location

#### 2. DEMANDS View
- Products/services consumers are looking for
- Map view + list view  
- Text search, filters by category, location
- Need cards with description, location

---

## 🎯 Phase 2.1 Objectives

1. Create the Marketplace module with clean architecture
2. Implement geolocation with PostGIS
3. Create dual views (Offers/Demands) with toggle
4. Implement dual visualization (Map/List) with toggle
5. Unified search and filter system
6. Optimized image loading
7. Responsive design for mobile
8. Complete testing (unit, integration, e2e)

---

## 🏗️ Marketplace Module Structure

```
backend/src/main/java/com/ecomama/modules/marketplace/
├── domain/
│   ├── model/
│   │   ├── Listing.java                    # Aggregate Root
│   │   ├── ListingType.java                # Enum: OFFER, DEMAND
│   │   ├── Category.java                   # Value Object
│   │   ├── Location.java                   # Value Object (PostGIS Point)
│   │   └── Price.java                      # Value Object
│   ├── repository/
│   │   └── ListingRepository.java          # Port
│   └── service/
│       ├── ListingValidationService.java   # Domain service
│       └── DistanceCalculationService.java # Domain service
├── application/
│   ├── usecase/
│   │   ├── CreateListingUseCase.java
│   │   ├── UpdateListingUseCase.java
│   │   ├── DeleteListingUseCase.java
│   │   ├── GetListingUseCase.java
│   │   ├── SearchListingsUseCase.java
│   │   └── GetNearbyListingsUseCase.java
│   ├── dto/
│   │   ├── request/
│   │   │   ├── CreateListingRequest.java
│   │   │   ├── UpdateListingRequest.java
│   │   │   ├── SearchListingsRequest.java
│   │   │   └── LocationRequest.java
│   │   └── response/
│   │       ├── ListingResponse.java
│   │       └── ListingDetailResponse.java
│   └── mapper/
│       └── ListingMapper.java              # MapStruct
├── infrastructure/
│   ├── persistence/
│   │   ├── JpaListingRepository.java       # Spring Data JPA
│   │   ├── ListingRepositoryAdapter.java   # Adapter
│   │   └── entity/
│   │       └── ListingEntity.java
│   └── storage/
│       ├── ImageStorageService.java        # Interface
│       └── LocalImageStorageService.java   # Implementation
└── presentation/
    └── controller/
        └── ListingController.java

frontend/src/
├── app/[locale]/
│   └── marketplace/
│       ├── page.tsx                        # Main marketplace page
│       ├── offers/
│       │   └── page.tsx                    # Offers view (redirect)
│       ├── demands/
│       │   └── page.tsx                    # Demands view (redirect)
│       └── [id]/
│           └── page.tsx                    # Listing detail page
├── components/
│   └── marketplace/
│       ├── index.ts
│       ├── MarketplaceLayout.tsx           # Main layout with tabs
│       ├── ViewToggle.tsx                  # Map/List toggle
│       ├── TypeToggle.tsx                  # Offers/Demands toggle
│       ├── SearchBar.tsx                   # Search input with autocomplete
│       ├── FilterPanel.tsx                 # Filters sidebar
│       ├── MapView.tsx                     # Leaflet map integration
│       ├── ListView.tsx                    # List of cards
│       ├── ListingCard.tsx                 # Card component
│       ├── ListingDetail.tsx               # Detail view
│       ├── ListingForm.tsx                 # Create/Edit form
│       └── ImageUpload.tsx                 # Image upload component
├── hooks/
│   └── marketplace/
│       ├── useListings.ts                  # React Query hook
│       ├── useSearchListings.ts
│       ├── useNearbyListings.ts
│       └── useUserLocation.ts
├── services/
│   └── marketplace.service.ts
└── types/
    └── marketplace.ts
```

---

## 📝 Implementation Plan by Subphases

### **Subphase 2.1.1: Backend - Domain Layer** ⏱️ Estimate: 1 day

#### Tasks:

1. **Create Value Objects**
   - `Location.java` - Wrapper for PostGIS Point
   - `Category.java` - Listing category
   - `Price.java` - Price with validation
   
2. **Create Enum**
   - `ListingType.java` - OFFER, DEMAND

3. **Create Aggregate Root**
   - `Listing.java` - Main entity
     - ID (UUID)
     - User ID (FK)
     - Title (validated)
     - Description
     - Type (OFFER/DEMAND)
     - Category
     - Location (PostGIS Point)
     - Images (array)
     - Price (optional)
     - Timestamps

4. **Create Repository Port**
   - `ListingRepository.java` - Interface with methods:
     - save()
     - findById()
     - findByUserId()
     - findByType()
     - searchByKeyword()
     - findNearby() - PostGIS query
     - findAll()

5. **Create Domain Services**
   - `ListingValidationService.java` - Business validations
   - `DistanceCalculationService.java` - Distance calculation

#### Files to create:
```
backend/src/main/java/com/ecomama/modules/marketplace/domain/
├── model/
│   ├── Listing.java
│   ├── ListingType.java
│   ├── Category.java
│   ├── Location.java
│   └── Price.java
├── repository/
│   └── ListingRepository.java
└── service/
    ├── ListingValidationService.java
    └── DistanceCalculationService.java
```

---

### **Subphase 2.1.2: Backend - Infrastructure Layer** ⏱️ Estimate: 1 day

#### Tasks:

1. **Create JPA Entity**
   - `ListingEntity.java` with PostGIS annotations
   - Mapping of custom types

2. **Create JPA Repository**
   - `JpaListingRepository.java` - Spring Data JPA
   - Custom queries with PostGIS
   - Query methods with @Query

3. **Create Repository Adapter**
   - `ListingRepositoryAdapter.java` - Implements ListingRepository
   - Mapping between Entity and Domain Model

4. **Create Flyway Migration**
   - `V2__Create_listings_table.sql`
   - PostGIS extension
   - Geospatial indexes
   - Search indexes

5. **Create Image Storage Service**
   - `ImageStorageService.java` - Interface
   - `LocalImageStorageService.java` - Local implementation
   - Image compression and optimization

#### Files to create:
```
backend/src/main/java/com/ecomama/modules/marketplace/infrastructure/
├── persistence/
│   ├── entity/
│   │   └── ListingEntity.java
│   ├── JpaListingRepository.java
│   └── ListingRepositoryAdapter.java
└── storage/
    ├── ImageStorageService.java
    └── LocalImageStorageService.java

backend/src/main/resources/db/migration/
└── V2__Create_listings_table.sql
```

---

### **Subphase 2.1.3: Backend - Application Layer** ⏱️ Estimate: 1.5 days

#### Tasks:

1. **Create Request DTOs**
   - `CreateListingRequest.java` - with Jakarta validations
   - `UpdateListingRequest.java`
   - `SearchListingsRequest.java` - filters, pagination
   - `LocationRequest.java` - lat, lon, radius

2. **Create Response DTOs**
   - `ListingResponse.java` - summary view
   - `ListingDetailResponse.java` - full view
   - `PagedListingsResponse.java` - pagination

3. **Create Mappers**
   - `ListingMapper.java` - MapStruct
   - Bidirectional mapping Entity <-> Domain <-> DTO

4. **Create Use Cases**
   - `CreateListingUseCase.java`
     - Authenticated user validation
     - Data validation
     - Location geocoding
     - Image saving
     - Listing creation
   
   - `UpdateListingUseCase.java`
     - Ownership validation
     - Partial update
     - Image management
   
   - `DeleteListingUseCase.java`
     - Hard delete from database
   
   - `GetListingUseCase.java`
     - Get by ID
     - Calculate distance to user
   
   - `SearchListingsUseCase.java`
     - Keyword search
     - Filters: type, category, location, radius
     - Pagination
     - Sorting
   
   - `GetNearbyListingsUseCase.java`
     - Geospatial search
     - Configurable radius

#### Files to create:
```
backend/src/main/java/com/ecomama/modules/marketplace/application/
├── dto/
│   ├── request/
│   │   ├── CreateListingRequest.java
│   │   ├── UpdateListingRequest.java
│   │   ├── SearchListingsRequest.java
│   │   └── LocationRequest.java
│   └── response/
│       ├── ListingResponse.java
│       ├── ListingDetailResponse.java
│       └── PagedListingsResponse.java
├── mapper/
│   └── ListingMapper.java
└── usecase/
    ├── CreateListingUseCase.java
    ├── UpdateListingUseCase.java
    ├── DeleteListingUseCase.java
    ├── GetListingUseCase.java
    ├── SearchListingsUseCase.java
    └── GetNearbyListingsUseCase.java
```

---

### **Subphase 2.1.4: Backend - Presentation Layer** ⏱️ Estimate: 0.5 days

#### Tasks:

1. **Create REST Controller**
   - `ListingController.java`
   - Endpoints:
     - `POST /api/v1/marketplace/listings` - Create
     - `GET /api/v1/marketplace/listings` - List with filters
     - `GET /api/v1/marketplace/listings/{id}` - Detail
     - `PUT /api/v1/marketplace/listings/{id}` - Update
     - `DELETE /api/v1/marketplace/listings/{id}` - Delete
     - `GET /api/v1/marketplace/listings/nearby` - Nearby
     - `POST /api/v1/marketplace/listings/{id}/images` - Upload image
   
2. **OpenAPI Documentation**
   - Swagger annotations
   - Request/response examples

3. **Validation and Error Handling**
   - Reuse GlobalExceptionHandler
   - Specific validations

#### Files to create:
```
backend/src/main/java/com/ecomama/modules/marketplace/presentation/
└── controller/
    └── ListingController.java
```

---

### **Subphase 2.1.5: Backend - Testing** ⏱️ Estimate: 1 day

#### Tasks:

1. **Unit Tests - Domain**
   - `ListingTest.java` - Domain methods test
   - `LocationTest.java` - Value object test
   - `PriceTest.java` - Validation test

2. **Unit Tests - Use Cases**
   - `CreateListingUseCaseTest.java`
   - `SearchListingsUseCaseTest.java`
   - `GetNearbyListingsUseCaseTest.java`
   - Repository mocks

3. **Integration Tests - Repository**
   - `ListingRepositoryTest.java`
   - Testcontainers with PostGIS
   - Geospatial queries test

4. **Integration Tests - Controller**
   - `ListingControllerTest.java`
   - Endpoint tests with MockMvc
   - Authentication test

5. **Fixtures and Helpers**
   - `ListingFixture.java` - Test data
   - `ListingAssertions.java` - Custom assertions

#### Files to create:
```
backend/src/test/java/com/ecomama/modules/marketplace/
├── domain/
│   ├── ListingTest.java
│   ├── LocationTest.java
│   └── PriceTest.java
├── application/usecase/
│   ├── CreateListingUseCaseTest.java
│   ├── SearchListingsUseCaseTest.java
│   └── GetNearbyListingsUseCaseTest.java
├── infrastructure/
│   └── ListingRepositoryTest.java
├── presentation/
│   └── ListingControllerTest.java
└── fixture/
    ├── ListingFixture.java
    └── ListingAssertions.java
```

---

### **Subphase 2.1.6: Frontend - Types & Services** ⏱️ Estimate: 0.5 days

#### Tasks:

1. **Create Types**
   - `marketplace.ts` - TypeScript interfaces
     - Listing
     - CreateListingDto
     - UpdateListingDto
     - SearchFilters
     - Location
     - MarketplaceView (MAP | LIST)
     - MarketplaceType (OFFERS | DEMANDS)

2. **Create Service**
   - `marketplace.service.ts`
   - HTTP methods using axios
   - Error handling

3. **Create React Query Hooks**
   - `useListings.ts` - List with filters
   - `useSearchListings.ts` - Search with debounce
   - `useNearbyListings.ts` - Nearby
   - `useListing.ts` - Detail
   - `useCreateListing.ts` - Create mutation
   - `useUpdateListing.ts` - Update mutation
   - `useDeleteListing.ts` - Delete mutation
   - `useUserLocation.ts` - Browser geolocation

#### Files to create:
```
frontend/src/
├── types/
│   └── marketplace.ts
├── services/
│   └── marketplace.service.ts
└── hooks/marketplace/
    ├── useListings.ts
    ├── useSearchListings.ts
    ├── useNearbyListings.ts
    ├── useListing.ts
    ├── useCreateListing.ts
    ├── useUpdateListing.ts
    ├── useDeleteListing.ts
    └── useUserLocation.ts
```

---

### **Subphase 2.1.7: Frontend - Core Components** ⏱️ Estimate: 1.5 days

#### Tasks:

1. **Component: ViewToggle**
   - Toggle between MAP and LIST
   - Icons: Map/Grid
   - Local state and persistence

2. **Component: TypeToggle**
   - Toggle between OFFERS and DEMANDS
   - Tabs or segmented control
   - Automatically updates filters

3. **Component: SearchBar**
   - Input with debounce
   - Optional autocomplete
   - Clear button
   - Loading state

4. **Component: FilterPanel**
   - Filters:
     - Category (select)
     - Location (radius slider)
     - Price range (slider)
   - Reset filters
   - Apply button
   - Responsive (drawer on mobile)

5. **Component: ListingCard**
   - Main image
   - Title, price
   - Category, location
   - Distance to user
   - Type badge (OFFER/DEMAND)
   - Link to detail
   - Responsive

6. **Component: ImageUpload**
   - Drag & drop
   - Preview
   - Client-side compression
   - Multi-upload
   - Size/type validation

#### Files to create:
```
frontend/src/components/marketplace/
├── index.ts
├── ViewToggle.tsx
├── TypeToggle.tsx
├── SearchBar.tsx
├── FilterPanel.tsx
├── ListingCard.tsx
└── ImageUpload.tsx
```

---

### **Subphase 2.1.8: Frontend - Map & List Views** ⏱️ Estimate: 2 days

#### Tasks:

1. **Component: MapView**
   - Leaflet + React-Leaflet integration
   - Custom markers (different for OFFER/DEMAND)
   - Marker clustering
   - Popup with listing preview
   - Auto-center on user location
   - Zoom controls
   - Marker click event -> go to detail
   - Loading skeleton

2. **Component: ListView**
   - Responsive grid of ListingCards
   - Pagination
   - Infinite scroll (optional)
   - Loading skeleton
   - Empty state
   - Error state

3. **Component: MarketplaceLayout**
   - Main layout with:
     - TypeToggle (top)
     - SearchBar (top)
     - FilterPanel (left sidebar, collapsible)
     - ViewToggle (top right)
     - MapView or ListView (center)
   - Responsive:
     - Mobile: FilterPanel as drawer
     - Desktop: Fixed FilterPanel

#### Files to create:
```
frontend/src/components/marketplace/
├── MapView.tsx
├── ListView.tsx
└── MarketplaceLayout.tsx
```

---

### **Subphase 2.1.9: Frontend - Detail & Forms** ⏱️ Estimate: 1.5 days

#### Tasks:

1. **Component: ListingDetail**
   - Image gallery (carousel)
   - Full information
   - Map with location
   - Contact button (direct message)
   - Edit button (if owner)
   - Delete button (if owner)
   - Breadcrumbs
   - Share button
   - Responsive

2. **Component: ListingForm**
   - Create/edit form
   - React Hook Form + Zod validation
   - Fields:
     - Title (required)
     - Description (textarea, required)
     - Type (OFFER/DEMAND, required)
     - Category (select, required)
     - Location (map picker, required)
     - Price (optional for DEMAND)
     - Images (multi-upload)
   - Real-time validation
   - Loading states
   - Error handling
   - Responsive

3. **Pages**
   - `/marketplace/page.tsx` - Main view (redirect to /offers)
   - `/marketplace/offers/page.tsx` - Offers
   - `/marketplace/demands/page.tsx` - Demands
   - `/marketplace/[id]/page.tsx` - Detail
   - `/marketplace/new/page.tsx` - Create (protected)
   - `/marketplace/[id]/edit/page.tsx` - Edit (protected)

#### Files to create:
```
frontend/src/
├── components/marketplace/
│   ├── ListingDetail.tsx
│   └── ListingForm.tsx
└── app/[locale]/marketplace/
    ├── page.tsx
    ├── offers/
    │   └── page.tsx
    ├── demands/
    │   └── page.tsx
    ├── new/
    │   └── page.tsx
    ├── [id]/
    │   ├── page.tsx
    │   └── edit/
    │       └── page.tsx
```

---

### **Subphase 2.1.10: Frontend - i18n & Styling** ⏱️ Estimate: 0.5 days

#### Tasks:

1. **Update i18n messages**
   - `messages/en.json` - Add marketplace texts
   - `messages/es.json` - Full translation

2. **Styling and theming**
   - Ensure responsive design
   - Dark mode support
   - Smooth animations
   - Loading skeletons
   - Empty states
   - Error states

3. **Optimizations**
   - Lazy loading components
   - Image optimization
   - Debounce on search
   - Component memoization

#### Files to modify:
```
frontend/src/messages/
├── en.json
└── es.json
```

---

### **Subphase 2.1.11: Frontend - Testing** ⏱️ Estimate: 1 day

#### Tasks:

1. **Component Tests**
   - `ListingCard.test.tsx`
   - `SearchBar.test.tsx`
   - `FilterPanel.test.tsx`
   - `ListingForm.test.tsx`
   - Testing Library + Jest

2. **Hook Tests**
   - `useListings.test.ts`
   - `useSearchListings.test.ts`
   - Mock React Query

3. **E2E Tests**
   - `marketplace.spec.ts` - Playwright
   - Flow: View offers -> Search -> Filter -> View detail
   - Flow: Create listing -> Edit -> Delete
   - Map test
   - List test

#### Files to create:
```
frontend/src/components/marketplace/__tests__/
├── ListingCard.test.tsx
├── SearchBar.test.tsx
├── FilterPanel.test.tsx
└── ListingForm.test.tsx

frontend/tests/
└── marketplace.spec.ts
```

---

### **Subphase 2.1.12: Performance & Optimization** ⏱️ Estimate: 1 day

#### Tasks:

1. **Backend Optimization**
   - DB indexes (geospatial, search)
   - Query optimization
   - Caching with Redis:
     - Frequent search cache
     - Category cache
     - Popular listings cache
   - Efficient pagination
   - Lazy image loading

2. **Frontend Optimization**
   - Route-based code splitting
   - Lazy loading map
   - Image compression
   - Debounce on search (300ms)
   - Skeleton loaders
   - Virtual scrolling for long lists (optional)

3. **Image Storage**
   - Automatic resize
   - Multiple sizes (thumbnail, medium, large)
   - WebP conversion
   - CDN setup (future)

---

### **Subphase 2.1.13: Documentation & Deployment** ⏱️ Estimate: 0.5 days

#### Tasks:

1. **API Documentation**
   - Complete Swagger/OpenAPI
   - Usage examples
   - Error codes

2. **Technical Documentation**
   - Module README
   - Architecture diagrams
   - Flow diagrams

3. **Deployment**
   - Verify Docker setup
   - Environment variables
   - Migration execution
   - Smoke tests on staging

4. **Update IMPLEMENTATION_PLAN.md**
   - Mark Phase 2.1 as completed
   - Document lessons learned

---

## 📊 Total Estimate

| Subphase | Estimate | Cumulative |
|----------|----------|------------|
| 2.1.1 - Domain Layer | 1 day | 1 day |
| 2.1.2 - Infrastructure | 1 day | 2 days |
| 2.1.3 - Application | 1.5 days | 3.5 days |
| 2.1.4 - Presentation | 0.5 days | 4 days |
| 2.1.5 - Backend Testing | 1 day | 5 days |
| 2.1.6 - Types & Services | 0.5 days | 5.5 days |
| 2.1.7 - Core Components | 1.5 days | 7 days |
| 2.1.8 - Map & List Views | 2 days | 9 days |
| 2.1.9 - Detail & Forms | 1.5 days | 10.5 days |
| 2.1.10 - i18n & Styling | 0.5 days | 11 days |
| 2.1.11 - Frontend Testing | 1 day | 12 days |
| 2.1.12 - Optimization | 1 day | 13 days |
| 2.1.13 - Docs & Deploy | 0.5 days | 13.5 days |

**Total: ~13.5 working days (2.7 weeks for 1 full-time developer)**

---

## 🎯 Applied Design Principles

### SOLID

1. **S - Single Responsibility**
   - Each class has a single responsibility
   - Use cases separated by operation
   - Components with a unique purpose

2. **O - Open/Closed**
   - Interfaces for repositories and services
   - Storage strategy (local/S3)
   - Extensible for new filter types

3. **L - Liskov Substitution**
   - Interchangeable implementations of ImageStorageService
   - Repository adapters

4. **I - Interface Segregation**
   - Small, specific interfaces
   - No unnecessary implementations

5. **D - Dependency Inversion**
   - Use cases depend on abstractions (ports)
   - Infrastructure implements abstractions

### DRY (Don't Repeat Yourself)

- Reuse existing UI components (Card, Button, Input)
- Shared utilities for validations
- Centralized mappers with MapStruct
- Reusable hooks
- Base classes for testing

### KISS (Keep It Simple, Stupid)

- Clear and direct architecture
- Simple, focused components
- Avoid over-engineering
- Prefer simple solutions

### YAGNI (You Aren't Gonna Need It)

- Do not implement features "just in case"
- Implement only what is specified
- Avoid premature optimizations
- Incremental implementation

---

## 🧪 Acceptance Criteria

### Backend

- [x] All entities and value objects created
- [x] Migrations executed correctly
- [x] All endpoints working
- [x] PostGIS queries working
- [x] Images are saved and retrieved correctly
- [x] Unit tests >80% coverage
- [x] Integration tests passing
- [x] Complete Swagger documentation

### Frontend

- [x] Offers view functional
- [x] Demands view functional
- [x] Offers/Demands toggle works
- [x] Map/List toggle works
- [x] Text search works
- [x] Filters work correctly
- [x] Map shows markers correctly
- [x] Marker clustering works
- [x] List shows cards correctly
- [x] Pagination works
- [x] Listing detail displays correctly
- [x] Creation form works
- [x] Edit form works
- [x] Image upload works
- [x] Responsive on mobile and desktop
- [x] Dark mode works
- [x] i18n EN/ES complete
- [x] Component tests >70% coverage
- [x] E2E tests passing

### Performance

- [x] Initial load time <2s
- [x] Debounced search
- [x] Optimized images
- [x] Properly indexed queries
- [x] Caching implemented

---

## 🚀 Recommended Implementation Order

### Week 1: Backend Foundation
- Day 1: Subphase 2.1.1 (Domain)
- Day 2: Subphase 2.1.2 (Infrastructure)
- Day 3-4: Subphase 2.1.3 (Application)
- Day 5: Subphase 2.1.4 (Presentation) + 2.1.5 (Testing)

### Week 2: Frontend Core
- Day 1: Subphase 2.1.6 (Types & Services)
- Day 2-3: Subphase 2.1.7 (Core Components)
- Day 4-5: Subphase 2.1.8 (Map & List Views)

### Week 3: Frontend Features & Polish
- Day 1-2: Subphase 2.1.9 (Detail & Forms)
- Day 3: Subphase 2.1.10 (i18n & Styling)
- Day 4: Subphase 2.1.11 (Frontend Testing)
- Day 5: Subphase 2.1.12 (Optimization) + 2.1.13 (Docs)

---

## 📝 Technical Notes

### PostGIS Setup

The database already has PostGIS enabled (see `infrastructure/init-db.sql`).

Example geospatial query:
```sql
SELECT * FROM listings 
WHERE ST_DWithin(
  location::geography,
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
  radius_in_meters
)
ORDER BY ST_Distance(
  location::geography,
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
);
```

### Leaflet Integration

Use `react-leaflet` which is already installed:
```tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
```

### Image Storage

Phase 1: Local storage
```
/uploads/listings/{listingId}/{timestamp}_{filename}
```

Phase 2 (future): AWS S3

### Nominatim Geocoding

Convert address to coordinates:
```typescript
const geocode = async (address: string) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  const data = await response.json();
  return { lat: data[0].lat, lon: data[0].lon };
};
```

---

## 🔄 Main User Flows

### Flow 1: View Offers on Map
1. User navigates to `/marketplace` (redirects to `/marketplace/offers`)
2. Default shows MAP view
3. Map loads nearby OFFER listings
4. User can zoom/pan
5. Click marker -> popup with preview
6. Click popup -> go to detail

### Flow 2: Search Demands in List
1. User switches tab to "Demands"
2. Toggle view to "List"
3. User types "tomatoes" in search bar
4. 300ms debounce, then backend query
5. List updates with results
6. User applies "Vegetables" category filter
7. List updates
8. Click card -> go to detail

### Flow 3: Create Offer
1. Authenticated user clicks "Create Offer"
2. Navigates to `/marketplace/new?type=offer`
3. Form pre-filled with type=OFFER
4. User fills out form
5. Selects location on map
6. Uploads images (max 5)
7. Submit -> client-side validation
8. POST to backend
9. Redirect to created listing detail

### Flow 4: Edit Listing
1. User on their own listing detail
2. Clicks "Edit"
3. Navigates to `/marketplace/{id}/edit`
4. Form pre-filled with current data
5. User edits fields
6. Submit -> PUT to backend
7. Redirect to updated detail

---

## ✅ Quality Checklist

### Before each commit
- [ ] Code formatted (Prettier/Checkstyle)
- [ ] Linter error-free
- [ ] Unit tests passing
- [ ] No console.logs
- [ ] No TODOs without ticket

### Before PR
- [ ] Integration tests passing
- [ ] Coverage >80% (backend), >70% (frontend)
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] UI screenshots/GIFs (if applicable)

### Before merging to main
- [ ] Code review approved
- [ ] E2E tests passing
- [ ] Performance verified
- [ ] Security scan passing
- [ ] Deployable to staging

---

## 🎨 UI/UX Design

### Color Palette (use Tailwind variables)
- Primary: Theme system (already configured)
- Success: Green for OFFER
- Warning: Orange for DEMAND
- Neutral: Theme grays

### Iconography
- Use `lucide-react` (already installed)
- Map: MapIcon
- List: ListIcon
- Search: SearchIcon
- Filter: FilterIcon
- Location: MapPinIcon
- Offer: TrendingUpIcon
- Demand: TrendingDownIcon

### Responsive Breakpoints
```typescript
// Tailwind defaults (already configured)
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile Layout
- Vertical stack
- FilterPanel as drawer (bottom sheet)
- Full width cards
- Map takes 50vh

### Desktop Layout
- Fixed left FilterPanel (300px)
- Central content area
- 3-column card grid
- Map 100% height

---

## 🔐 Security

### Backend
- Ownership validation for edit/delete
- File type validation
- Input sanitization
- Rate limiting on searches
- CORS configured

### Frontend
- Client-side validation (Zod)
- URL sanitization
- No exposure of sensitive internal IDs
- HTTPS only in production

---

## 📦 New Dependencies

No new dependencies required. Everything needed is already installed:

### Backend (already installed)
- `org.hibernate.orm:hibernate-spatial` ✅
- `org.postgresql:postgresql` ✅
- `org.mapstruct:mapstruct` ✅
- `commons-io:commons-io` ✅

### Frontend (already installed)
- `leaflet` ✅
- `react-leaflet` ✅
- `@tanstack/react-query` ✅
- `axios` ✅
- `zod` ✅
- `react-hook-form` ✅

---

## 🎓 Reference Resources

### PostGIS
- [PostGIS Documentation](https://postgis.net/docs/)
- [PostGIS with Hibernate](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#spatial)

### Leaflet
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [React Leaflet](https://react-leaflet.js.org/)

### Clean Architecture
- Existing auth module as reference
- Domain-driven design patterns

---

This is the complete implementation strategy. Would you like me to start with a specific subphase?
