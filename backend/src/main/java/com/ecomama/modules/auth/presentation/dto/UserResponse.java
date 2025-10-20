package com.ecomama.modules.auth.presentation.dto;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String role,
        boolean emailVerified,
        ProfileResponse profile,
        Instant createdAt,
        Instant lastLoginAt
) {
}
