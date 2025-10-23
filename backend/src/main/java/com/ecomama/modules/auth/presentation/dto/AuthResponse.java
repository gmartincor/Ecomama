package com.ecomama.modules.auth.presentation.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Authentication response with tokens and user information")
public record AuthResponse(
        @Schema(description = "JWT access token for API authentication", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        String accessToken,
        
        @Schema(description = "Refresh token for obtaining new access tokens", example = "550e8400-e29b-41d4-a716-446655440000")
        String refreshToken,
        
        @Schema(description = "Authenticated user information")
        UserResponse user
) {
}
