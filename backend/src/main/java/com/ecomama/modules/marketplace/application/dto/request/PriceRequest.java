package com.ecomama.modules.marketplace.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Schema(description = "Price information request")
public record PriceRequest(
        @Schema(
            description = "Price amount",
            example = "25.50",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minimum = "0.00",
            maximum = "999999.99"
        )
        @NotNull(message = "Price amount is required")
        @DecimalMin(value = "0.00", message = "Price must be greater than or equal to 0")
        @DecimalMax(value = "999999.99", message = "Price cannot exceed 999999.99")
        BigDecimal amount,

        @Schema(
            description = "Currency code (ISO 4217)",
            example = "EUR",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minLength = 3,
            maxLength = 3
        )
        @NotBlank(message = "Currency is required")
        @Size(min = 3, max = 3, message = "Currency must be a 3-letter ISO code")
        String currency
) {
}
