package com.ecomama.modules.marketplace.infrastructure.persistence;

import com.ecomama.modules.marketplace.domain.model.Listing;
import com.ecomama.modules.marketplace.domain.model.ListingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JpaListingRepository extends JpaRepository<Listing, UUID> {

    List<Listing> findByUserId(UUID userId);

    Page<Listing> findByType(ListingType type, Pageable pageable);

    Page<Listing> findByCategory(String category, Pageable pageable);

    Page<Listing> findByCategoryAndType(String category, ListingType type, Pageable pageable);

    @Query("SELECT l FROM Listing l WHERE " +
           "LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Listing> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT l FROM Listing l WHERE " +
           "l.type = :type AND (" +
           "LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.category) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Listing> searchByKeywordAndType(
        @Param("keyword") String keyword,
        @Param("type") ListingType type,
        Pageable pageable
    );

    @Query(value = "SELECT * FROM listings l WHERE " +
           "ST_DWithin(l.location::geography, " +
           "ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography, " +
           ":radiusMeters) " +
           "ORDER BY ST_Distance(l.location::geography, " +
           "ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography)",
           nativeQuery = true)
    Page<Listing> findNearby(
        @Param("latitude") double latitude,
        @Param("longitude") double longitude,
        @Param("radiusMeters") double radiusMeters,
        Pageable pageable
    );

    @Query(value = "SELECT * FROM listings l WHERE " +
           "l.type = CAST(:type AS listing_type) AND " +
           "ST_DWithin(l.location::geography, " +
           "ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography, " +
           ":radiusMeters) " +
           "ORDER BY ST_Distance(l.location::geography, " +
           "ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography)",
           nativeQuery = true)
    Page<Listing> findNearbyByType(
        @Param("latitude") double latitude,
        @Param("longitude") double longitude,
        @Param("radiusMeters") double radiusMeters,
        @Param("type") String type,
        Pageable pageable
    );

    @Query(value = "SELECT * FROM listings l WHERE " +
           "(:keyword IS NULL OR " +
           "LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(l.category) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:type IS NULL OR l.type = CAST(:type AS listing_type)) AND " +
           "(:category IS NULL OR l.category = :category) AND " +
           "(:latitude IS NULL OR :longitude IS NULL OR :radiusMeters IS NULL OR " +
           "ST_DWithin(l.location::geography, " +
           "ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography, " +
           ":radiusMeters)) " +
           "ORDER BY " +
           "CASE WHEN :latitude IS NOT NULL AND :longitude IS NOT NULL " +
           "THEN ST_Distance(l.location::geography, " +
           "ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography) " +
           "ELSE 0 END, " +
           "l.created_at DESC",
           nativeQuery = true)
    Page<Listing> advancedSearch(
        @Param("keyword") String keyword,
        @Param("type") String type,
        @Param("category") String category,
        @Param("latitude") Double latitude,
        @Param("longitude") Double longitude,
        @Param("radiusMeters") Double radiusMeters,
        Pageable pageable
    );
}
