package com.ecomama.modules.marketplace.domain.model;

import com.ecomama.shared.domain.ValueObject;
import com.ecomama.shared.exception.ValidationException;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode
public class Location implements ValueObject {

    private static final double MIN_LATITUDE = -90.0;
    private static final double MAX_LATITUDE = 90.0;
    private static final double MIN_LONGITUDE = -180.0;
    private static final double MAX_LONGITUDE = 180.0;

    private final double latitude;
    private final double longitude;

    private Location(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public static Location of(double latitude, double longitude) {
        validateLatitude(latitude);
        validateLongitude(longitude);
        return new Location(latitude, longitude);
    }

    private static void validateLatitude(double latitude) {
        if (latitude < MIN_LATITUDE || latitude > MAX_LATITUDE) {
            throw new ValidationException(
                String.format("Latitude must be between %.1f and %.1f", MIN_LATITUDE, MAX_LATITUDE)
            );
        }
    }

    private static void validateLongitude(double longitude) {
        if (longitude < MIN_LONGITUDE || longitude > MAX_LONGITUDE) {
            throw new ValidationException(
                String.format("Longitude must be between %.1f and %.1f", MIN_LONGITUDE, MAX_LONGITUDE)
            );
        }
    }

    @Override
    public String toString() {
        return String.format("(%.6f, %.6f)", latitude, longitude);
    }
}
