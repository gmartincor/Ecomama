package com.ecomama.modules.marketplace.domain.model;

import com.ecomama.shared.domain.ValueObject;
import com.ecomama.shared.exception.ValidationException;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Getter
@EqualsAndHashCode
public class Price implements ValueObject {

    private static final BigDecimal MIN_PRICE = BigDecimal.ZERO;
    private static final BigDecimal MAX_PRICE = new BigDecimal("999999.99");

    private final BigDecimal amount;
    private final String currency;

    private Price(BigDecimal amount, String currency) {
        this.amount = amount;
        this.currency = currency;
    }

    public static Price of(BigDecimal amount, String currency) {
        validateAmount(amount);
        validateCurrency(currency);
        return new Price(amount.setScale(2, RoundingMode.HALF_UP), currency.toUpperCase());
    }

    public static Price of(double amount, String currency) {
        return of(BigDecimal.valueOf(amount), currency);
    }

    private static void validateAmount(BigDecimal amount) {
        if (amount == null) {
            throw new ValidationException("Price amount cannot be null");
        }
        
        if (amount.compareTo(MIN_PRICE) < 0) {
            throw new ValidationException("Price cannot be negative");
        }
        
        if (amount.compareTo(MAX_PRICE) > 0) {
            throw new ValidationException(
                String.format("Price cannot exceed %s", MAX_PRICE)
            );
        }
    }

    private static void validateCurrency(String currency) {
        if (currency == null || currency.isBlank()) {
            throw new ValidationException("Currency cannot be empty");
        }
        
        String normalized = currency.trim().toUpperCase();
        if (normalized.length() != 3) {
            throw new ValidationException("Currency must be a 3-letter ISO code");
        }
    }

    @Override
    public String toString() {
        return String.format("%s %.2f", currency, amount);
    }
}
