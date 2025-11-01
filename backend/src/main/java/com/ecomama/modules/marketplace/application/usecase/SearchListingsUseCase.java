package com.ecomama.modules.marketplace.application.usecase;

import com.ecomama.modules.marketplace.application.dto.request.SearchListingsRequest;
import com.ecomama.modules.marketplace.application.dto.response.ListingResponse;
import com.ecomama.modules.marketplace.application.mapper.ListingMapper;
import com.ecomama.modules.marketplace.domain.model.Listing;
import com.ecomama.modules.marketplace.domain.model.ListingType;
import com.ecomama.modules.marketplace.domain.model.Location;
import com.ecomama.modules.marketplace.domain.repository.ListingRepository;
import com.ecomama.modules.marketplace.domain.service.DistanceCalculationService;
import com.ecomama.modules.marketplace.domain.service.ListingValidationService;
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
public class SearchListingsUseCase {

    private final ListingRepository listingRepository;
    private final ListingMapper listingMapper;
    private final DistanceCalculationService distanceCalculationService;
    private final ListingValidationService validationService;

    @Transactional(readOnly = true)
    public Page<ListingResponse> execute(SearchListingsRequest request) {
        log.info("Searching listings with filters: type={}, category={}, keyword={}", 
                request.type(), request.category(), request.keyword());

        validationService.validateSearchParameters(request.keyword(), request.radiusKm());

        Pageable pageable = createPageable(request);

        ListingType type = request.type() != null && !request.type().isBlank() 
                ? ListingType.valueOf(request.type()) 
                : null;

        Page<Listing> listings = listingRepository.advancedSearch(
                request.keyword(),
                type,
                request.category(),
                request.latitude(),
                request.longitude(),
                request.radiusKm(),
                pageable
        );

        return listings.map(listing -> {
            Double distanceKm = calculateDistance(listing, request.latitude(), request.longitude());
            return listingMapper.toResponseWithDistance(listing, distanceKm);
        });
    }

    private Pageable createPageable(SearchListingsRequest request) {
        Sort sort = createSort(request.sortBy(), request.sortDirection());
        return PageRequest.of(request.page(), request.size(), sort);
    }

    private Sort createSort(String sortBy, String sortDirection) {
        Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection) 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;

        return Sort.by(direction, sortBy);
    }

    private Double calculateDistance(Listing listing, Double userLatitude, Double userLongitude) {
        if (userLatitude == null || userLongitude == null) {
            return null;
        }

        Location userLocation = Location.of(userLatitude, userLongitude);
        Location listingLocation = listing.getLocationValue();
        return distanceCalculationService.calculateDistance(userLocation, listingLocation);
    }
}
