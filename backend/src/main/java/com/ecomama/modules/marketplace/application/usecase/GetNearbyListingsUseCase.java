package com.ecomama.modules.marketplace.application.usecase;

import com.ecomama.modules.marketplace.application.dto.response.ListingResponse;
import com.ecomama.modules.marketplace.application.mapper.ListingMapper;
import com.ecomama.modules.marketplace.domain.model.Listing;
import com.ecomama.modules.marketplace.domain.model.ListingType;
import com.ecomama.modules.marketplace.domain.model.Location;
import com.ecomama.modules.marketplace.domain.repository.ListingRepository;
import com.ecomama.modules.marketplace.domain.service.DistanceCalculationService;
import com.ecomama.modules.marketplace.domain.service.ListingValidationService;
import com.ecomama.shared.exception.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GetNearbyListingsUseCase {

    private final ListingRepository listingRepository;
    private final ListingMapper listingMapper;
    private final DistanceCalculationService distanceCalculationService;
    private final ListingValidationService validationService;

    @Transactional(readOnly = true)
    public Page<ListingResponse> execute(
            double latitude, 
            double longitude, 
            double radiusKm,
            ListingType type,
            int page,
            int size
    ) {
        log.info("Searching nearby listings: lat={}, lon={}, radius={}km, type={}", 
                latitude, longitude, radiusKm, type);

        if (latitude < -90 || latitude > 90) {
            throw new ValidationException("Invalid latitude");
        }
        
        if (longitude < -180 || longitude > 180) {
            throw new ValidationException("Invalid longitude");
        }

        validationService.validateSearchParameters(null, radiusKm);

        Pageable pageable = PageRequest.of(
                page, 
                size, 
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Listing> listings = type != null
                ? listingRepository.findNearbyByType(latitude, longitude, radiusKm, type, pageable)
                : listingRepository.findNearby(latitude, longitude, radiusKm, pageable);

        Location userLocation = Location.of(latitude, longitude);

        return listings.map(listing -> {
            Location listingLocation = listing.getLocationValue();
            double distance = distanceCalculationService.calculateDistance(userLocation, listingLocation);
            return listingMapper.toResponseWithDistance(listing, distance);
        });
    }
}
