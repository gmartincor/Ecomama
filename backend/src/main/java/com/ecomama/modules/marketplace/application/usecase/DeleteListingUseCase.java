package com.ecomama.modules.marketplace.application.usecase;

import com.ecomama.modules.marketplace.domain.model.Listing;
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
public class DeleteListingUseCase {

    private final ListingRepository listingRepository;
    private final ListingValidationService validationService;

    @Transactional
    public void execute(UUID userId, UUID listingId) {
        log.info("Deleting listing {} for user: {}", listingId, userId);

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new NotFoundException("Listing not found"));

        validationService.validateOwnership(listing, userId);

        listingRepository.delete(listing);

        log.info("Listing deleted successfully: {}", listingId);
    }
}
