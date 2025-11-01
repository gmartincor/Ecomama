package com.ecomama.modules.marketplace.application.usecase;

import com.ecomama.modules.marketplace.application.dto.response.ListingResponse;
import com.ecomama.modules.marketplace.application.mapper.ListingMapper;
import com.ecomama.modules.marketplace.domain.model.Listing;
import com.ecomama.modules.marketplace.domain.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class GetUserListingsUseCase {

    private final ListingRepository listingRepository;
    private final ListingMapper listingMapper;

    @Transactional(readOnly = true)
    public List<ListingResponse> execute(UUID userId) {
        log.info("Fetching listings for user: {}", userId);

        List<Listing> listings = listingRepository.findByUserId(userId);

        return listingMapper.toResponseList(listings);
    }
}
