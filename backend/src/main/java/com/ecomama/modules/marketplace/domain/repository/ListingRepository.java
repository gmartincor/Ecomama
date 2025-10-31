package com.ecomama.modules.marketplace.domain.repository;

import com.ecomama.modules.marketplace.domain.model.Listing;
import com.ecomama.modules.marketplace.domain.model.ListingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ListingRepository {

    Listing save(Listing listing);

    Optional<Listing> findById(UUID id);

    List<Listing> findByUserId(UUID userId);

    Page<Listing> findAll(Pageable pageable);

    Page<Listing> findByType(ListingType type, Pageable pageable);

    Page<Listing> searchByKeyword(String keyword, Pageable pageable);

    Page<Listing> searchByKeywordAndType(String keyword, ListingType type, Pageable pageable);

    Page<Listing> findNearby(double latitude, double longitude, double radiusKm, Pageable pageable);

    Page<Listing> findNearbyByType(
            double latitude, 
            double longitude, 
            double radiusKm, 
            ListingType type, 
            Pageable pageable
    );

    Page<Listing> findByCategory(String category, Pageable pageable);

    Page<Listing> findByCategoryAndType(String category, ListingType type, Pageable pageable);

    Page<Listing> advancedSearch(
            String keyword,
            ListingType type,
            String category,
            Double latitude,
            Double longitude,
            Double radiusKm,
            Pageable pageable
    );

    void delete(Listing listing);

    void deleteById(UUID id);

    boolean existsById(UUID id);
}
