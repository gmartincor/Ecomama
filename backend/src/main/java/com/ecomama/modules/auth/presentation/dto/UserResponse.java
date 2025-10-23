package com.ecomama.modules.auth.presentation.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "User information response")
public record UserResponse(
        @Schema(description = "Unique user identifier", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,
        
        @Schema(description = "User email address", example = "farmer@example.com")
        String email,
        
        @Schema(description = "User role in the system", example = "USER", allowableValues = {"USER", "ADMIN", "SUPERADMIN"})
        String role,
        
        @Schema(description = "Email verification status", example = "true")
        boolean emailVerified,
        
        @Schema(description = "User profile information")
        ProfileResponse profile,
        
        @Schema(description = "Account creation timestamp", example = "2024-01-01T12:00:00Z")
        Instant createdAt,
        
        @Schema(description = "Last login timestamp", example = "2024-01-15T08:30:00Z")
        Instant lastLoginAt
) {
}
