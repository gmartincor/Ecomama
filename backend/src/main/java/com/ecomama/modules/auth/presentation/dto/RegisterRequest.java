package com.ecomama.modules.auth.presentation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "User registration request")
public record RegisterRequest(
        @Schema(
            description = "User email address",
            example = "farmer@example.com",
            requiredMode = Schema.RequiredMode.REQUIRED
        )
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @Schema(
            description = "User password (minimum 8 characters)",
            example = "SecurePass123!",
            format = "password",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minLength = 8,
            maxLength = 100
        )
        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
        String password,

        @Schema(
            description = "User first name",
            example = "John",
            requiredMode = Schema.RequiredMode.REQUIRED,
            maxLength = 100
        )
        @NotBlank(message = "First name is required")
        @Size(max = 100, message = "First name must not exceed 100 characters")
        String firstName,

        @Schema(
            description = "User last name",
            example = "Doe",
            requiredMode = Schema.RequiredMode.REQUIRED,
            maxLength = 100
        )
        @NotBlank(message = "Last name is required")
        @Size(max = 100, message = "Last name must not exceed 100 characters")
        String lastName,

        @Schema(
            description = "Preferred locale for user interface and communications",
            example = "en",
            defaultValue = "en",
            allowableValues = {"en", "es"},
            maxLength = 5
        )
        @Size(max = 5, message = "Locale must not exceed 5 characters")
        String preferredLocale
) {
    public RegisterRequest {
        if (preferredLocale == null || preferredLocale.isBlank()) {
            preferredLocale = "en";
        }
    }
}
