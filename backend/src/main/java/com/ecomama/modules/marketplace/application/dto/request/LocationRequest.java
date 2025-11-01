package com.ecomama.modules.marketplace.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Location coordinates request")
public record LocationRequest(
        @Schema(
            description = "Latitude coordinate",
            example = "40.416775",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minimum = "-90.0",
            maximum = "90.0"
        )
        @NotNull(message = "Latitude is required")
        @DecimalMin(value = "-90.0", message = "Latitude must be between -90.0 and 90.0")
        @DecimalMax(value = "90.0", message = "Latitude must be between -90.0 and 90.0")
        Double latitude,

        @Schema(
            description = "Longitude coordinate",
            example = "-3.703790",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minimum = "-180.0",
            maximum = "180.0"
        )
        @NotNull(message = "Longitude is required")
        @DecimalMin(value = "-180.0", message = "Longitude must be between -180.0 and 180.0")
        @DecimalMax(value = "180.0", message = "Longitude must be between -180.0 and 180.0")
        Double longitude
) {
}
