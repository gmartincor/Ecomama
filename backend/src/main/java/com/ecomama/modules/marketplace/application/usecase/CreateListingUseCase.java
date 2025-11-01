package com.ecomama.modules.marketplace.application.usecase;

import com.ecomama.modules.marketplace.application.dto.request.CreateListingRequest;
import com.ecomama.modules.marketplace.application.dto.response.ListingDetailResponse;
import com.ecomama.modules.marketplace.application.mapper.ListingMapper;
import com.ecomama.modules.marketplace.domain.model.*;
import com.ecomama.modules.marketplace.domain.repository.ListingRepository;
import com.ecomama.modules.marketplace.domain.service.ListingValidationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CreateListingUseCase {

    private final ListingRepository listingRepository;
    private final ListingValidationService validationService;
    private final ListingMapper listingMapper;

    @Transactional
    public ListingDetailResponse execute(UUID userId, CreateListingRequest request) {
        log.info("Creating new {} listing for user: {}", request.type(), userId);

        validationService.validateListingForCreation(userId, request.title(), request.description());

        Category category = Category.of(request.category());
        Location location = Location.of(request.latitude(), request.longitude());
        
        Price price = null;
        if (request.priceAmount() != null && request.priceCurrency() != null) {
            price = Price.of(request.priceAmount(), request.priceCurrency());
        }

        ListingType type = ListingType.valueOf(request.type());

        Listing listing = Listing.create(
                userId,
                request.title(),
                request.description(),
                type,
                category,
                location,
                price
        );

        if (request.images() != null && !request.images().isEmpty()) {
            for (String imageUrl : request.images()) {
                listing.addImage(imageUrl);
            }
        }

        Listing savedListing = listingRepository.save(listing);

        log.info("Listing created successfully with ID: {}", savedListing.getId());

        return listingMapper.toDetailResponse(savedListing);
    }
}
