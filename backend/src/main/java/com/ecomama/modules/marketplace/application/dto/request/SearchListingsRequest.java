package com.ecomama.modules.marketplace.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request to search listings with filters")
public record SearchListingsRequest(
        @Schema(
            description = "Search keyword (searches in title, description, category)",
            example = "tomatoes"
        )
        String keyword,

        @Schema(
            description = "Type filter",
            example = "OFFER",
            allowableValues = {"OFFER", "DEMAND"}
        )
        String type,

        @Schema(
            description = "Category filter",
            example = "Vegetables"
        )
        String category,

        @Schema(
            description = "Latitude for proximity search",
            example = "40.4168",
            minimum = "-90",
            maximum = "90"
        )
        Double latitude,

        @Schema(
            description = "Longitude for proximity search",
            example = "-3.7038",
            minimum = "-180",
            maximum = "180"
        )
        Double longitude,

        @Schema(
            description = "Search radius in kilometers",
            example = "50",
            minimum = "0.1",
            maximum = "1000"
        )
        Double radiusKm,

        @Schema(
            description = "Page number (zero-based)",
            example = "0",
            defaultValue = "0"
        )
        Integer page,

        @Schema(
            description = "Page size",
            example = "20",
            defaultValue = "20"
        )
        Integer size,

        @Schema(
            description = "Sort field",
            example = "createdAt",
            allowableValues = {"createdAt", "title", "priceAmount"}
        )
        String sortBy,

        @Schema(
            description = "Sort direction",
            example = "DESC",
            allowableValues = {"ASC", "DESC"}
        )
        String sortDirection
) {
    public SearchListingsRequest {
        if (page == null || page < 0) {
            page = 0;
        }
        if (size == null || size < 1) {
            size = 20;
        }
        if (size > 100) {
            size = 100;
        }
        if (sortBy == null || sortBy.isBlank()) {
            sortBy = "createdAt";
        }
        if (sortDirection == null || sortDirection.isBlank()) {
            sortDirection = "DESC";
        }
    }
}
