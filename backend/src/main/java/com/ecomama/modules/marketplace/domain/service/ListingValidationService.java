package com.ecomama.modules.marketplace.domain.service;

import com.ecomama.modules.marketplace.domain.model.Listing;
import com.ecomama.shared.exception.ValidationException;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class ListingValidationService {

    public void validateOwnership(Listing listing, UUID userId) {
        if (listing == null) {
            throw new ValidationException("Listing cannot be null");
        }
        
        if (userId == null) {
            throw new ValidationException("User ID cannot be null");
        }
        
        if (!listing.belongsTo(userId)) {
            throw new ValidationException("You do not have permission to modify this listing");
        }
    }

    public void validateListingForCreation(
            UUID userId,
            String title,
            String description
    ) {
        if (userId == null) {
            throw new ValidationException("User ID cannot be null");
        }
        
        if (title == null || title.isBlank()) {
            throw new ValidationException("Title cannot be empty");
        }
        
        if (description == null || description.isBlank()) {
            throw new ValidationException("Description cannot be empty");
        }
    }

    public void validateSearchParameters(
            String keyword,
            Double radiusKm
    ) {
        if (keyword != null && keyword.trim().length() < 2) {
            throw new ValidationException("Search keyword must be at least 2 characters");
        }
        
        if (radiusKm != null && radiusKm <= 0) {
            throw new ValidationException("Search radius must be positive");
        }
        
        if (radiusKm != null && radiusKm > 1000) {
            throw new ValidationException("Search radius cannot exceed 1000 km");
        }
    }

    public Map<String, String> validateAllFields(
            String title,
            String description,
            String category,
            Double latitude,
            Double longitude
    ) {
        Map<String, String> errors = new java.util.HashMap<>();
        
        if (title == null || title.isBlank()) {
            errors.put("title", "Title cannot be empty");
        } else if (title.trim().length() < 3) {
            errors.put("title", "Title must be at least 3 characters");
        } else if (title.trim().length() > 100) {
            errors.put("title", "Title cannot exceed 100 characters");
        }
        
        if (description == null || description.isBlank()) {
            errors.put("description", "Description cannot be empty");
        } else if (description.trim().length() < 10) {
            errors.put("description", "Description must be at least 10 characters");
        } else if (description.trim().length() > 2000) {
            errors.put("description", "Description cannot exceed 2000 characters");
        }
        
        if (category == null || category.isBlank()) {
            errors.put("category", "Category cannot be empty");
        }
        
        if (latitude == null) {
            errors.put("latitude", "Latitude cannot be null");
        } else if (latitude < -90 || latitude > 90) {
            errors.put("latitude", "Latitude must be between -90 and 90");
        }
        
        if (longitude == null) {
            errors.put("longitude", "Longitude cannot be null");
        } else if (longitude < -180 || longitude > 180) {
            errors.put("longitude", "Longitude must be between -180 and 180");
        }
        
        if (!errors.isEmpty()) {
            throw new ValidationException("Validation failed", errors);
        }
        
        return errors;
    }
}
