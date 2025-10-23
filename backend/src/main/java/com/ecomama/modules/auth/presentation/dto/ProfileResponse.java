package com.ecomama.modules.auth.presentation.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User profile information")
public record ProfileResponse(
        @Schema(description = "User first name", example = "John")
        String firstName,
        
        @Schema(description = "User last name", example = "Doe")
        String lastName,
        
        @Schema(description = "Contact phone number", example = "+1234567890")
        String phoneNumber,
        
        @Schema(description = "User biography", example = "Organic farmer with 10 years of experience")
        String bio,
        
        @Schema(description = "Profile picture URL", example = "https://example.com/avatars/user.jpg")
        String avatarUrl,
        
        @Schema(description = "User city", example = "Barcelona")
        String city,
        
        @Schema(description = "User country", example = "Spain")
        String country
) {
}
