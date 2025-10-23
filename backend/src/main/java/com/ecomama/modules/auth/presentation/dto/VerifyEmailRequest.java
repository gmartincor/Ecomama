package com.ecomama.modules.auth.presentation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Email verification token request")
public record VerifyEmailRequest(
        @Schema(
            description = "Email verification token received via email",
            example = "abc123def456ghi789",
            requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = "Token is required")
        String token
) {
}
