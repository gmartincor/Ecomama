package com.ecomama.modules.marketplace.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Schema(description = "Listing summary response")
public record ListingResponse(
        @Schema(description = "Unique listing identifier", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,

        @Schema(description = "User who created the listing", example = "123e4567-e89b-12d3-a456-426614174000")
        UUID userId,

        @Schema(description = "Listing title", example = "Fresh Organic Tomatoes")
        String title,

        @Schema(description = "Short description", example = "Fresh organic tomatoes...")
        String description,

        @Schema(description = "Listing type", example = "OFFER", allowableValues = {"OFFER", "DEMAND"})
        String type,

        @Schema(description = "Category", example = "Vegetables")
        String category,

        @Schema(description = "Latitude coordinate", example = "40.4168")
        Double latitude,

        @Schema(description = "Longitude coordinate", example = "-3.7038")
        Double longitude,

        @Schema(description = "Price amount", example = "5.99")
        BigDecimal priceAmount,

        @Schema(description = "Currency code", example = "EUR")
        String priceCurrency,

        @Schema(description = "First image URL", example = "/uploads/listings/123/image.jpg")
        String imageUrl,

        @Schema(description = "Listing active status", example = "true")
        boolean active,

        @Schema(description = "Distance to user in kilometers (if applicable)", example = "15.2")
        Double distanceKm,

        @Schema(description = "Creation timestamp", example = "2024-01-01T12:00:00Z")
        Instant createdAt
) {
}
