# Ecomama API Documentation

## Overview

The Ecomama API is a RESTful service that powers the Ecomama marketplace platform connecting farmers and consumers for organic products. This document provides comprehensive guidance on using the API.

## Base URLs

- **Development**: `http://localhost:8080`
- **Staging**: `https://staging.ecomama.com`
- **Production**: `https://api.ecomama.com`

## Interactive Documentation

Access the interactive Swagger UI documentation at:
- Development: http://localhost:8080/swagger-ui.html
- Production: https://api.ecomama.com/swagger-ui.html

OpenAPI Specification (JSON format):
- Development: http://localhost:8080/v3/api-docs
- Production: https://api.ecomama.com/v3/api-docs

## Authentication

Most API endpoints require authentication using JWT (JSON Web Tokens).

### Authentication Flow

1. **Register** a new user account: `POST /api/v1/auth/register`
2. **Verify** your email address: `POST /api/v1/auth/verify-email`
3. **Login** to obtain tokens: `POST /api/v1/auth/login`
4. **Use** the access token in subsequent requests

### Using Access Tokens

Include the access token in the `Authorization` header of your requests:

```
Authorization: Bearer <your_access_token>
```

### Token Expiration

- **Access Token**: Valid for 1 hour
- **Refresh Token**: Valid for 7 days

When your access token expires, use the refresh token to obtain a new one:

```bash
POST /api/v1/auth/refresh-token
{
  "refreshToken": "your_refresh_token"
}
```

## API Endpoints

### Authentication (`/api/v1/auth`)

#### Register New User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "preferredLocale": "en"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "farmer@example.com",
      "role": "USER",
      "emailVerified": false
    }
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "SecurePass123!"
}
```

#### Verify Email
```http
POST /api/v1/auth/verify-email
Content-Type: application/json

{
  "token": "abc123def456ghi789"
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

### User Profile (`/api/v1/users`)

#### Get Current User Profile
```http
GET /api/v1/users/me
Authorization: Bearer <access_token>
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "farmer@example.com",
    "role": "USER",
    "emailVerified": true,
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "bio": "Organic farmer with 10 years of experience",
      "city": "Barcelona",
      "country": "Spain"
    },
    "createdAt": "2024-01-01T12:00:00Z",
    "lastLoginAt": "2024-01-15T08:30:00Z"
  },
  "timestamp": "2024-01-15T08:30:00Z"
}
```

#### Update User Profile
```http
PUT /api/v1/users/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "bio": "Updated bio text",
  "city": "Madrid",
  "country": "Spain"
}
```

### Password Management (`/api/v1/password`)

#### Request Password Reset
```http
POST /api/v1/password/forgot
Content-Type: application/json

{
  "email": "farmer@example.com"
}
```

#### Reset Password
```http
POST /api/v1/password/reset
Content-Type: application/json

{
  "token": "abc123def456ghi789",
  "newPassword": "NewSecurePass123!"
}
```

#### Change Password (Authenticated)
```http
POST /api/v1/password/change
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "CurrentPass123!",
  "newPassword": "NewSecurePass123!"
}
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Validation error for this field"
    }
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `AUTHENTICATION_FAILED` | 401 | Invalid credentials or token |
| `ACCESS_DENIED` | 403 | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource not found |
| `RESOURCE_CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated users**: 1000 requests per hour
- **Anonymous users**: 100 requests per hour

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

## Versioning

The API uses URL-based versioning (e.g., `/api/v1/...`). Major versions are incremented when breaking changes are introduced.

## Localization

The API supports multiple languages. Set your preferred locale during registration or specify it in requests using the `Accept-Language` header:

```
Accept-Language: en
Accept-Language: es
```

Supported locales:
- `en`: English (default)
- `es`: Spanish

## Pagination

Endpoints that return collections support pagination:

```http
GET /api/v1/resource?page=0&size=20&sort=createdAt,desc
```

Parameters:
- `page`: Page number (0-indexed, default: 0)
- `size`: Items per page (default: 20, max: 100)
- `sort`: Sort field and direction (format: `field,direction`)

Response includes pagination metadata:

```json
{
  "success": true,
  "data": {
    "content": [...],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 20
    },
    "totalElements": 150,
    "totalPages": 8,
    "last": false
  }
}
```

## Filtering and Searching

Use query parameters for filtering:

```http
GET /api/v1/listings?category=vegetables&location=Barcelona&minPrice=5
```

## Best Practices

### Security
1. **HTTPS Only**: Always use HTTPS in production
2. **Token Storage**: Store tokens securely (never in localStorage for web apps)
3. **Token Refresh**: Implement automatic token refresh before expiration
4. **Logout**: Clear tokens on logout

### Performance
1. **Caching**: Leverage HTTP caching headers
2. **Pagination**: Use pagination for large datasets
3. **Compression**: Enable gzip compression
4. **Selective Fields**: Request only needed fields when supported

### Error Handling
1. **Retry Logic**: Implement exponential backoff for retries
2. **Validation**: Validate requests client-side before sending
3. **Error Display**: Show user-friendly error messages
4. **Logging**: Log errors for debugging

## SDK and Libraries

Official SDKs are available for:
- JavaScript/TypeScript (coming soon)
- Python (coming soon)
- Java (coming soon)

## Support

- **Email**: support@ecomama.com
- **Documentation**: https://docs.ecomama.com
- **GitHub**: https://github.com/ecomama/api
- **Status Page**: https://status.ecomama.com

## Changelog

### v1.0.0 (2024-01-01)
- Initial API release
- Authentication and user management endpoints
- Basic profile management
- Password management flows

---

For the latest updates and detailed endpoint documentation, please refer to the interactive Swagger UI documentation.
