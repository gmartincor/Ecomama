package com.ecomama.modules.marketplace.application.usecase;

import com.ecomama.modules.marketplace.application.dto.response.ListingDetailResponse;
import com.ecomama.modules.marketplace.application.mapper.ListingMapper;
import com.ecomama.modules.marketplace.domain.model.Listing;
import com.ecomama.modules.marketplace.domain.model.Location;
import com.ecomama.modules.marketplace.domain.repository.ListingRepository;
import com.ecomama.modules.marketplace.domain.service.DistanceCalculationService;
import com.ecomama.shared.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class GetListingUseCase {

    private final ListingRepository listingRepository;
    private final ListingMapper listingMapper;
    private final DistanceCalculationService distanceCalculationService;

    @Transactional(readOnly = true)
    public ListingDetailResponse execute(UUID listingId, Double userLatitude, Double userLongitude) {
        log.info("Fetching listing: {}", listingId);

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new NotFoundException("Listing not found"));

        Double distanceKm = null;
        if (userLatitude != null && userLongitude != null) {
            Location userLocation = Location.of(userLatitude, userLongitude);
            Location listingLocation = listing.getLocationValue();
            distanceKm = distanceCalculationService.calculateDistance(userLocation, listingLocation);
        }

        return listingMapper.toDetailResponseWithDistance(listing, distanceKm);
    }
}
