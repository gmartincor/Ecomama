package com.ecomama.modules.marketplace.domain.model;

import com.ecomama.shared.domain.AggregateRoot;
import com.ecomama.shared.exception.ValidationException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "listings", indexes = {
        @Index(name = "idx_listings_user_id", columnList = "user_id"),
        @Index(name = "idx_listings_type", columnList = "type"),
        @Index(name = "idx_listings_category", columnList = "category"),
        @Index(name = "idx_listings_created_at", columnList = "created_at"),
        @Index(name = "idx_listings_location", columnList = "location")
})
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Listing extends AggregateRoot<UUID> {

    private static final int TITLE_MIN_LENGTH = 3;
    private static final int TITLE_MAX_LENGTH = 100;
    private static final int DESCRIPTION_MIN_LENGTH = 10;
    private static final int DESCRIPTION_MAX_LENGTH = 2000;
    private static final int MAX_IMAGES = 5;
    private static final GeometryFactory GEOMETRY_FACTORY = 
        new GeometryFactory(new PrecisionModel(), 4326);

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, length = TITLE_MAX_LENGTH)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ListingType type;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, columnDefinition = "geography(Point, 4326)")
    private Point location;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "listing_images", joinColumns = @JoinColumn(name = "listing_id"))
    @Column(name = "image_url", length = 500)
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Column(precision = 10, scale = 2)
    private BigDecimal priceAmount;

    @Column(length = 3)
    private String priceCurrency;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    public static Listing create(
            UUID userId,
            String title,
            String description,
            ListingType type,
            Category category,
            Location location,
            Price price
    ) {
        validateTitle(title);
        validateDescription(description);
        
        if (userId == null) {
            throw new ValidationException("User ID cannot be null");
        }
        if (type == null) {
            throw new ValidationException("Listing type cannot be null");
        }
        if (category == null) {
            throw new ValidationException("Category cannot be null");
        }
        if (location == null) {
            throw new ValidationException("Location cannot be null");
        }

        Point point = GEOMETRY_FACTORY.createPoint(
            new Coordinate(location.getLongitude(), location.getLatitude())
        );

        return Listing.builder()
                .userId(userId)
                .title(title.trim())
                .description(description.trim())
                .type(type)
                .category(category.getValue())
                .location(point)
                .priceAmount(price != null ? price.getAmount() : null)
                .priceCurrency(price != null ? price.getCurrency() : null)
                .active(true)
                .images(new ArrayList<>())
                .build();
    }

    public void updateDetails(String title, String description, Category category, Price price) {
        if (title != null && !title.isBlank()) {
            validateTitle(title);
            this.title = title.trim();
        }
        
        if (description != null && !description.isBlank()) {
            validateDescription(description);
            this.description = description.trim();
        }
        
        if (category != null) {
            this.category = category.getValue();
        }
        
        if (price != null) {
            this.priceAmount = price.getAmount();
            this.priceCurrency = price.getCurrency();
        }
    }

    public void updateLocation(Location newLocation) {
        if (newLocation == null) {
            throw new ValidationException("Location cannot be null");
        }
        
        this.location = GEOMETRY_FACTORY.createPoint(
            new Coordinate(newLocation.getLongitude(), newLocation.getLatitude())
        );
    }

    public void addImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new ValidationException("Image URL cannot be empty");
        }
        
        if (images.size() >= MAX_IMAGES) {
            throw new ValidationException(
                String.format("Cannot add more than %d images", MAX_IMAGES)
            );
        }
        
        images.add(imageUrl.trim());
    }

    public void removeImage(String imageUrl) {
        images.remove(imageUrl);
    }

    public void clearImages() {
        images.clear();
    }

    public void activate() {
        this.active = true;
    }

    public void deactivate() {
        this.active = false;
    }

    public Location getLocationValue() {
        if (location == null) {
            return null;
        }
        return Location.of(location.getY(), location.getX());
    }

    public Price getPriceValue() {
        if (priceAmount == null || priceCurrency == null) {
            return null;
        }
        return Price.of(priceAmount, priceCurrency);
    }

    public Category getCategoryValue() {
        return Category.of(category);
    }

    public boolean belongsTo(UUID userId) {
        return this.userId.equals(userId);
    }

    private static void validateTitle(String title) {
        if (title == null || title.isBlank()) {
            throw new ValidationException("Title cannot be empty");
        }
        
        String trimmed = title.trim();
        if (trimmed.length() < TITLE_MIN_LENGTH) {
            throw new ValidationException(
                String.format("Title must be at least %d characters", TITLE_MIN_LENGTH)
            );
        }
        
        if (trimmed.length() > TITLE_MAX_LENGTH) {
            throw new ValidationException(
                String.format("Title cannot exceed %d characters", TITLE_MAX_LENGTH)
            );
        }
    }

    private static void validateDescription(String description) {
        if (description == null || description.isBlank()) {
            throw new ValidationException("Description cannot be empty");
        }
        
        String trimmed = description.trim();
        if (trimmed.length() < DESCRIPTION_MIN_LENGTH) {
            throw new ValidationException(
                String.format("Description must be at least %d characters", DESCRIPTION_MIN_LENGTH)
            );
        }
        
        if (trimmed.length() > DESCRIPTION_MAX_LENGTH) {
            throw new ValidationException(
                String.format("Description cannot exceed %d characters", DESCRIPTION_MAX_LENGTH)
            );
        }
    }
}
