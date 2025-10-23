package com.ecomama.modules.auth.presentation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Password reset with token request")
public record ResetPasswordRequest(
        @Schema(
            description = "Password reset token received via email",
            example = "abc123def456ghi789",
            requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = "Token is required")
        String token,

        @Schema(
            description = "New password (minimum 8 characters)",
            example = "NewSecurePass123!",
            format = "password",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minLength = 8,
            maxLength = 100
        )
        @NotBlank(message = "New password is required")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
        String newPassword
) {
}
