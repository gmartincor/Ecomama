package com.ecomama.modules.marketplace.domain.service;

import com.ecomama.modules.marketplace.domain.model.Location;
import org.springframework.stereotype.Service;

@Service
public class DistanceCalculationService {

    private static final double EARTH_RADIUS_KM = 6371.0;

    public double calculateDistance(Location from, Location to) {
        if (from == null || to == null) {
            throw new IllegalArgumentException("Locations cannot be null");
        }

        return calculateDistance(
            from.getLatitude(),
            from.getLongitude(),
            to.getLatitude(),
            to.getLongitude()
        );
    }

    public double calculateDistance(
            double lat1,
            double lon1,
            double lat2,
            double lon2
    ) {
        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);
        double deltaLat = Math.toRadians(lat2 - lat1);
        double deltaLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
                + Math.cos(lat1Rad) * Math.cos(lat2Rad)
                * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }

    public boolean isWithinRadius(Location from, Location to, double radiusKm) {
        return calculateDistance(from, to) <= radiusKm;
    }

    public boolean isWithinRadius(
            double lat1,
            double lon1,
            double lat2,
            double lon2,
            double radiusKm
    ) {
        return calculateDistance(lat1, lon1, lat2, lon2) <= radiusKm;
    }
}
