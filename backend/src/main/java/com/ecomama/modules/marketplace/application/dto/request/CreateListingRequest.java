package com.ecomama.modules.marketplace.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

@Schema(description = "Request to create a new marketplace listing")
public record CreateListingRequest(
        @Schema(
            description = "Listing title",
            example = "Fresh Organic Tomatoes",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minLength = 3,
            maxLength = 100
        )
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        String title,

        @Schema(
            description = "Detailed description of the listing",
            example = "Fresh organic tomatoes grown without pesticides. Available for pickup or delivery within 10km.",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minLength = 10,
            maxLength = 2000
        )
        @NotBlank(message = "Description is required")
        @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
        String description,

        @Schema(
            description = "Type of listing",
            example = "OFFER",
            requiredMode = Schema.RequiredMode.REQUIRED,
            allowableValues = {"OFFER", "DEMAND"}
        )
        @NotNull(message = "Type is required")
        String type,

        @Schema(
            description = "Category of the listing",
            example = "Vegetables",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minLength = 2,
            maxLength = 50
        )
        @NotBlank(message = "Category is required")
        @Size(min = 2, max = 50, message = "Category must be between 2 and 50 characters")
        String category,

        @Schema(
            description = "Latitude coordinate",
            example = "40.4168",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minimum = "-90",
            maximum = "90"
        )
        @NotNull(message = "Latitude is required")
        @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
        @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
        Double latitude,

        @Schema(
            description = "Longitude coordinate",
            example = "-3.7038",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minimum = "-180",
            maximum = "180"
        )
        @NotNull(message = "Longitude is required")
        @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
        @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
        Double longitude,

        @Schema(
            description = "Price amount (optional, especially for DEMAND listings)",
            example = "5.99",
            minimum = "0",
            maximum = "999999.99"
        )
        @DecimalMin(value = "0.0", message = "Price cannot be negative")
        @DecimalMax(value = "999999.99", message = "Price cannot exceed 999999.99")
        BigDecimal priceAmount,

        @Schema(
            description = "Currency code (ISO 4217)",
            example = "EUR",
            minLength = 3,
            maxLength = 3
        )
        @Size(min = 3, max = 3, message = "Currency must be a 3-letter ISO code")
        String priceCurrency,

        @Schema(
            description = "Image URLs (optional, can be added later)",
            example = "[\"https://example.com/image1.jpg\"]"
        )
        @Size(max = 5, message = "Maximum 5 images allowed")
        List<String> images
) {
}
