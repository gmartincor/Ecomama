package com.ecomama.modules.marketplace.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Schema(description = "Request to update an existing marketplace listing")
public record UpdateListingRequest(
        @Schema(
            description = "Listing title",
            example = "Fresh Organic Tomatoes - Updated",
            minLength = 3,
            maxLength = 100
        )
        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        String title,

        @Schema(
            description = "Detailed description of the listing",
            example = "Fresh organic tomatoes grown without pesticides. Now with delivery option!",
            minLength = 10,
            maxLength = 2000
        )
        @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
        String description,

        @Schema(
            description = "Category of the listing",
            example = "Vegetables",
            minLength = 2,
            maxLength = 50
        )
        @Size(min = 2, max = 50, message = "Category must be between 2 and 50 characters")
        String category,

        @Schema(
            description = "Latitude coordinate",
            example = "40.4168",
            minimum = "-90",
            maximum = "90"
        )
        @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
        @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
        Double latitude,

        @Schema(
            description = "Longitude coordinate",
            example = "-3.7038",
            minimum = "-180",
            maximum = "180"
        )
        @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
        @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
        Double longitude,

        @Schema(
            description = "Price amount",
            example = "6.99",
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
        String priceCurrency
) {
}
