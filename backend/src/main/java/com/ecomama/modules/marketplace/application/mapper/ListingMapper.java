package com.ecomama.modules.marketplace.application.mapper;

import com.ecomama.modules.marketplace.application.dto.response.ListingDetailResponse;
import com.ecomama.modules.marketplace.application.dto.response.ListingResponse;
import com.ecomama.modules.marketplace.domain.model.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ListingMapper {

    @Mapping(target = "type", expression = "java(listing.getType().name())")
    @Mapping(target = "latitude", expression = "java(listing.getLocationValue() != null ? listing.getLocationValue().getLatitude() : null)")
    @Mapping(target = "longitude", expression = "java(listing.getLocationValue() != null ? listing.getLocationValue().getLongitude() : null)")
    @Mapping(target = "priceAmount", expression = "java(listing.getPriceValue() != null ? listing.getPriceValue().getAmount() : null)")
    @Mapping(target = "priceCurrency", expression = "java(listing.getPriceValue() != null ? listing.getPriceValue().getCurrency() : null)")
    @Mapping(target = "imageUrl", expression = "java(listing.getImages() != null && !listing.getImages().isEmpty() ? listing.getImages().get(0) : null)")
    @Mapping(target = "distanceKm", ignore = true)
    ListingResponse toResponse(Listing listing);

    @Mapping(target = "type", expression = "java(listing.getType().name())")
    @Mapping(target = "latitude", expression = "java(listing.getLocationValue() != null ? listing.getLocationValue().getLatitude() : null)")
    @Mapping(target = "longitude", expression = "java(listing.getLocationValue() != null ? listing.getLocationValue().getLongitude() : null)")
    @Mapping(target = "priceAmount", expression = "java(listing.getPriceValue() != null ? listing.getPriceValue().getAmount() : null)")
    @Mapping(target = "priceCurrency", expression = "java(listing.getPriceValue() != null ? listing.getPriceValue().getCurrency() : null)")
    @Mapping(target = "distanceKm", ignore = true)
    ListingDetailResponse toDetailResponse(Listing listing);

    List<ListingResponse> toResponseList(List<Listing> listings);

    default ListingResponse toResponseWithDistance(Listing listing, Double distanceKm) {
        ListingResponse response = toResponse(listing);
        return new ListingResponse(
            response.id(),
            response.userId(),
            response.title(),
            response.description(),
            response.type(),
            response.category(),
            response.latitude(),
            response.longitude(),
            response.priceAmount(),
            response.priceCurrency(),
            response.imageUrl(),
            response.active(),
            distanceKm,
            response.createdAt()
        );
    }

    default ListingDetailResponse toDetailResponseWithDistance(Listing listing, Double distanceKm) {
        ListingDetailResponse response = toDetailResponse(listing);
        return new ListingDetailResponse(
            response.id(),
            response.userId(),
            response.title(),
            response.description(),
            response.type(),
            response.category(),
            response.latitude(),
            response.longitude(),
            response.priceAmount(),
            response.priceCurrency(),
            response.images(),
            response.active(),
            distanceKm,
            response.createdAt(),
            response.updatedAt()
        );
    }
}
