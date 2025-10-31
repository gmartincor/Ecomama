package com.ecomama.modules.marketplace.infrastructure.persistence;

import com.ecomama.modules.marketplace.domain.model.Listing;
import com.ecomama.modules.marketplace.domain.model.ListingType;
import com.ecomama.modules.marketplace.domain.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ListingRepositoryAdapter implements ListingRepository {

    private final JpaListingRepository jpaListingRepository;

    @Override
    public Listing save(Listing listing) {
        return jpaListingRepository.save(listing);
    }

    @Override
    public Optional<Listing> findById(UUID id) {
        return jpaListingRepository.findById(id);
    }

    @Override
    public List<Listing> findByUserId(UUID userId) {
        return jpaListingRepository.findByUserId(userId);
    }

    @Override
    public Page<Listing> findAll(Pageable pageable) {
        return jpaListingRepository.findAll(pageable);
    }

    @Override
    public Page<Listing> findByType(ListingType type, Pageable pageable) {
        return jpaListingRepository.findByType(type, pageable);
    }

    @Override
    public Page<Listing> searchByKeyword(String keyword, Pageable pageable) {
        return jpaListingRepository.searchByKeyword(keyword, pageable);
    }

    @Override
    public Page<Listing> searchByKeywordAndType(String keyword, ListingType type, Pageable pageable) {
        return jpaListingRepository.searchByKeywordAndType(keyword, type, pageable);
    }

    @Override
    public Page<Listing> findNearby(double latitude, double longitude, double radiusKm, Pageable pageable) {
        double radiusMeters = radiusKm * 1000;
        return jpaListingRepository.findNearby(latitude, longitude, radiusMeters, pageable);
    }

    @Override
    public Page<Listing> findNearbyByType(
            double latitude,
            double longitude,
            double radiusKm,
            ListingType type,
            Pageable pageable
    ) {
        double radiusMeters = radiusKm * 1000;
        return jpaListingRepository.findNearbyByType(latitude, longitude, radiusMeters, type.name(), pageable);
    }

    @Override
    public Page<Listing> findByCategory(String category, Pageable pageable) {
        return jpaListingRepository.findByCategory(category, pageable);
    }

    @Override
    public Page<Listing> findByCategoryAndType(String category, ListingType type, Pageable pageable) {
        return jpaListingRepository.findByCategoryAndType(category, type, pageable);
    }

    @Override
    public Page<Listing> advancedSearch(
            String keyword,
            ListingType type,
            String category,
            Double latitude,
            Double longitude,
            Double radiusKm,
            Pageable pageable
    ) {
        Double radiusMeters = radiusKm != null ? radiusKm * 1000 : null;
        String typeStr = type != null ? type.name() : null;
        
        return jpaListingRepository.advancedSearch(
            keyword,
            typeStr,
            category,
            latitude,
            longitude,
            radiusMeters,
            pageable
        );
    }

    @Override
    public void delete(Listing listing) {
        jpaListingRepository.delete(listing);
    }

    @Override
    public void deleteById(UUID id) {
        jpaListingRepository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaListingRepository.existsById(id);
    }
}
