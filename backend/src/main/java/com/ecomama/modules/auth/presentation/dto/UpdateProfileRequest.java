package com.ecomama.modules.auth.presentation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "User profile update request")
public record UpdateProfileRequest(
        @Schema(description = "User first name", example = "John", maxLength = 100)
        @Size(max = 100, message = "First name must not exceed 100 characters")
        String firstName,

        @Schema(description = "User last name", example = "Doe", maxLength = 100)
        @Size(max = 100, message = "Last name must not exceed 100 characters")
        String lastName,

        @Schema(description = "Contact phone number", example = "+1234567890", maxLength = 20)
        @Size(max = 20, message = "Phone number must not exceed 20 characters")
        String phoneNumber,

        @Schema(description = "User biography or description", example = "Organic farmer with 10 years of experience", maxLength = 1000)
        @Size(max = 1000, message = "Bio must not exceed 1000 characters")
        String bio,

        @Schema(description = "Profile picture URL", example = "https://example.com/avatars/user.jpg", maxLength = 500)
        @Size(max = 500, message = "Avatar URL must not exceed 500 characters")
        String avatarUrl,

        @Schema(description = "User city", example = "Barcelona", maxLength = 100)
        @Size(max = 100, message = "City must not exceed 100 characters")
        String city,

        @Schema(description = "User country", example = "Spain", maxLength = 100)
        @Size(max = 100, message = "Country must not exceed 100 characters")
        String country
) {
}
