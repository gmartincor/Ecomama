package com.ecomama.modules.marketplace.domain.model;

import com.ecomama.shared.domain.ValueObject;
import com.ecomama.shared.exception.ValidationException;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode
public class Category implements ValueObject {

    private static final int MIN_LENGTH = 2;
    private static final int MAX_LENGTH = 50;

    private final String value;

    private Category(String value) {
        this.value = value;
    }

    public static Category of(String category) {
        if (category == null || category.isBlank()) {
            throw new ValidationException("Category cannot be empty");
        }
        
        String normalized = category.trim();
        
        if (normalized.length() < MIN_LENGTH) {
            throw new ValidationException(
                String.format("Category must be at least %d characters", MIN_LENGTH)
            );
        }
        
        if (normalized.length() > MAX_LENGTH) {
            throw new ValidationException(
                String.format("Category cannot exceed %d characters", MAX_LENGTH)
            );
        }
        
        return new Category(normalized);
    }

    @Override
    public String toString() {
        return value;
    }
}
