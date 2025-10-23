package com.ecomama.modules.auth.presentation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Password change request for authenticated users")
public record ChangePasswordRequest(
        @Schema(
            description = "Current password for verification",
            example = "CurrentPass123!",
            format = "password",
            requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = "Current password is required")
        String currentPassword,

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
