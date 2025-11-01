package com.ecomama.modules.marketplace.application.usecase;

import com.ecomama.modules.marketplace.application.dto.request.UpdateListingRequest;
import com.ecomama.modules.marketplace.application.dto.response.ListingDetailResponse;
import com.ecomama.modules.marketplace.application.mapper.ListingMapper;
import com.ecomama.modules.marketplace.domain.model.Category;
import com.ecomama.modules.marketplace.domain.model.Listing;
import com.ecomama.modules.marketplace.domain.model.Location;
import com.ecomama.modules.marketplace.domain.model.Price;
import com.ecomama.modules.marketplace.domain.repository.ListingRepository;
import com.ecomama.modules.marketplace.domain.service.ListingValidationService;
import com.ecomama.shared.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UpdateListingUseCase {

    private final ListingRepository listingRepository;
    private final ListingValidationService validationService;
    private final ListingMapper listingMapper;

    @Transactional
    public ListingDetailResponse execute(UUID userId, UUID listingId, UpdateListingRequest request) {
        log.info("Updating listing {} for user: {}", listingId, userId);

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new NotFoundException("Listing not found"));

        validationService.validateOwnership(listing, userId);

        Category category = null;
        if (request.category() != null && !request.category().isBlank()) {
            category = Category.of(request.category());
        }

        Price price = null;
        if (request.priceAmount() != null && request.priceCurrency() != null) {
            price = Price.of(request.priceAmount(), request.priceCurrency());
        }

        listing.updateDetails(request.title(), request.description(), category, price);

        if (request.latitude() != null && request.longitude() != null) {
            Location location = Location.of(request.latitude(), request.longitude());
            listing.updateLocation(location);
        }

        Listing updatedListing = listingRepository.save(listing);

        log.info("Listing updated successfully: {}", updatedListing.getId());

        return listingMapper.toDetailResponse(updatedListing);
    }
}
