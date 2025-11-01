package com.ecomama.modules.marketplace.presentation.controller;

import com.ecomama.modules.auth.infrastructure.security.CustomUserDetails;
import com.ecomama.modules.marketplace.application.dto.request.CreateListingRequest;
import com.ecomama.modules.marketplace.application.dto.request.SearchListingsRequest;
import com.ecomama.modules.marketplace.application.dto.request.UpdateListingRequest;
import com.ecomama.modules.marketplace.application.dto.response.ListingDetailResponse;
import com.ecomama.modules.marketplace.application.dto.response.ListingResponse;
import com.ecomama.modules.marketplace.application.usecase.*;
import com.ecomama.modules.marketplace.domain.model.ListingType;
import com.ecomama.shared.api.ApiResponse;
import com.ecomama.shared.api.doc.ApiDocumentation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/marketplace/listings")
@RequiredArgsConstructor
@Tag(name = "Marketplace", description = "Marketplace listings management - offers and demands")
public class ListingController {

    private final CreateListingUseCase createListingUseCase;
    private final GetListingUseCase getListingUseCase;
    private final SearchListingsUseCase searchListingsUseCase;
    private final UpdateListingUseCase updateListingUseCase;
    private final DeleteListingUseCase deleteListingUseCase;
    private final GetNearbyListingsUseCase getNearbyListingsUseCase;
    private final GetUserListingsUseCase getUserListingsUseCase;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
        summary = "Create new listing",
        description = "Creates a new marketplace listing (OFFER or DEMAND). Authenticated users can create listings to offer products/services or request them from others."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "201",
        description = "Listing created successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": {
                    "id": "550e8400-e29b-41d4-a716-446655440000",
                    "userId": "123e4567-e89b-12d3-a456-426614174000",
                    "title": "Fresh Organic Tomatoes",
                    "description": "Fresh organic tomatoes grown without pesticides",
                    "type": "OFFER",
                    "category": "Vegetables",
                    "latitude": 40.4168,
                    "longitude": -3.7038,
                    "priceAmount": 5.99,
                    "priceCurrency": "EUR",
                    "images": [],
                    "active": true,
                    "distanceKm": null,
                    "createdAt": "2024-01-01T12:00:00Z",
                    "updatedAt": "2024-01-01T12:00:00Z"
                  },
                  "timestamp": "2024-01-01T12:00:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    @AuthErrorResponses
    public ApiResponse<ListingDetailResponse> createListing(
            Authentication authentication,
            @Valid @RequestBody CreateListingRequest request) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getUserId();
        ListingDetailResponse response = createListingUseCase.execute(userId, request);
        return ApiResponse.success(response);
    }

    @GetMapping
    @Operation(
        summary = "Search listings with filters",
        description = "Search marketplace listings with advanced filters including keyword search, type (OFFER/DEMAND), category, location proximity, pagination and sorting. Supports both map and list views."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Listings retrieved successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": {
                    "content": [
                      {
                        "id": "550e8400-e29b-41d4-a716-446655440000",
                        "userId": "123e4567-e89b-12d3-a456-426614174000",
                        "title": "Fresh Organic Tomatoes",
                        "description": "Fresh organic tomatoes...",
                        "type": "OFFER",
                        "category": "Vegetables",
                        "latitude": 40.4168,
                        "longitude": -3.7038,
                        "priceAmount": 5.99,
                        "priceCurrency": "EUR",
                        "imageUrl": "/uploads/listings/123/image.jpg",
                        "active": true,
                        "distanceKm": 15.2,
                        "createdAt": "2024-01-01T12:00:00Z"
                      }
                    ],
                    "pageable": {
                      "pageNumber": 0,
                      "pageSize": 20
                    },
                    "totalElements": 1,
                    "totalPages": 1
                  },
                  "timestamp": "2024-01-01T12:00:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    public ApiResponse<Page<ListingResponse>> searchListings(
            @Parameter(description = "Search keyword") @RequestParam(required = false) String keyword,
            @Parameter(description = "Listing type: OFFER or DEMAND") @RequestParam(required = false) String type,
            @Parameter(description = "Category filter") @RequestParam(required = false) String category,
            @Parameter(description = "User latitude for proximity") @RequestParam(required = false) Double latitude,
            @Parameter(description = "User longitude for proximity") @RequestParam(required = false) Double longitude,
            @Parameter(description = "Search radius in km") @RequestParam(required = false) Double radiusKm,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(description = "Page size (max 100)") @RequestParam(defaultValue = "20") Integer size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction: ASC or DESC") @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        SearchListingsRequest request = new SearchListingsRequest(
                keyword, type, category, latitude, longitude, radiusKm,
                page, size, sortBy, sortDirection
        );
        
        Page<ListingResponse> response = searchListingsUseCase.execute(request);
        return ApiResponse.success(response);
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get listing by ID",
        description = "Retrieves detailed information about a specific listing. Optionally calculates distance from user location if coordinates are provided."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Listing retrieved successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": {
                    "id": "550e8400-e29b-41d4-a716-446655440000",
                    "userId": "123e4567-e89b-12d3-a456-426614174000",
                    "title": "Fresh Organic Tomatoes",
                    "description": "Fresh organic tomatoes grown without pesticides. Available for pickup or delivery within 10km.",
                    "type": "OFFER",
                    "category": "Vegetables",
                    "latitude": 40.4168,
                    "longitude": -3.7038,
                    "priceAmount": 5.99,
                    "priceCurrency": "EUR",
                    "images": ["/uploads/listings/123/image1.jpg", "/uploads/listings/123/image2.jpg"],
                    "active": true,
                    "distanceKm": 15.2,
                    "createdAt": "2024-01-01T12:00:00Z",
                    "updatedAt": "2024-01-01T12:00:00Z"
                  },
                  "timestamp": "2024-01-01T12:00:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    @NotFoundResponse
    public ApiResponse<ListingDetailResponse> getListing(
            @Parameter(description = "Listing ID") @PathVariable UUID id,
            @Parameter(description = "User latitude") @RequestParam(required = false) Double latitude,
            @Parameter(description = "User longitude") @RequestParam(required = false) Double longitude) {
        ListingDetailResponse response = getListingUseCase.execute(id, latitude, longitude);
        return ApiResponse.success(response);
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
        summary = "Update listing",
        description = "Updates an existing listing. Only the owner can update their listing. All fields are optional - only provided fields will be updated."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Listing updated successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": {
                    "id": "550e8400-e29b-41d4-a716-446655440000",
                    "userId": "123e4567-e89b-12d3-a456-426614174000",
                    "title": "Fresh Organic Tomatoes - Updated",
                    "description": "Fresh organic tomatoes grown without pesticides. Now with delivery!",
                    "type": "OFFER",
                    "category": "Vegetables",
                    "latitude": 40.4168,
                    "longitude": -3.7038,
                    "priceAmount": 6.99,
                    "priceCurrency": "EUR",
                    "images": [],
                    "active": true,
                    "distanceKm": null,
                    "createdAt": "2024-01-01T12:00:00Z",
                    "updatedAt": "2024-01-02T10:30:00Z"
                  },
                  "timestamp": "2024-01-02T10:30:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    @AuthErrorResponses
    @NotFoundResponse
    public ApiResponse<ListingDetailResponse> updateListing(
            Authentication authentication,
            @Parameter(description = "Listing ID") @PathVariable UUID id,
            @Valid @RequestBody UpdateListingRequest request) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getUserId();
        ListingDetailResponse response = updateListingUseCase.execute(userId, id, request);
        return ApiResponse.success(response);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
        summary = "Delete listing",
        description = "Permanently deletes a listing. Only the owner can delete their listing."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "204",
        description = "Listing deleted successfully"
    )
    @StandardErrorResponses
    @AuthErrorResponses
    @NotFoundResponse
    public void deleteListing(
            Authentication authentication,
            @Parameter(description = "Listing ID") @PathVariable UUID id) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getUserId();
        deleteListingUseCase.execute(userId, id);
    }

    @GetMapping("/nearby")
    @Operation(
        summary = "Get nearby listings",
        description = "Retrieves listings within a specified radius from given coordinates. Useful for map view. Results are sorted by distance."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Nearby listings retrieved successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": {
                    "content": [
                      {
                        "id": "550e8400-e29b-41d4-a716-446655440000",
                        "userId": "123e4567-e89b-12d3-a456-426614174000",
                        "title": "Fresh Organic Tomatoes",
                        "description": "Fresh organic tomatoes...",
                        "type": "OFFER",
                        "category": "Vegetables",
                        "latitude": 40.4168,
                        "longitude": -3.7038,
                        "priceAmount": 5.99,
                        "priceCurrency": "EUR",
                        "imageUrl": "/uploads/listings/123/image.jpg",
                        "active": true,
                        "distanceKm": 5.3,
                        "createdAt": "2024-01-01T12:00:00Z"
                      }
                    ],
                    "pageable": {
                      "pageNumber": 0,
                      "pageSize": 20
                    },
                    "totalElements": 1,
                    "totalPages": 1
                  },
                  "timestamp": "2024-01-01T12:00:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    public ApiResponse<Page<ListingResponse>> getNearbyListings(
            @Parameter(description = "Latitude", required = true) @RequestParam double latitude,
            @Parameter(description = "Longitude", required = true) @RequestParam double longitude,
            @Parameter(description = "Search radius in km") @RequestParam(defaultValue = "50") double radiusKm,
            @Parameter(description = "Listing type: OFFER or DEMAND") @RequestParam(required = false) String type,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size (max 100)") @RequestParam(defaultValue = "20") int size) {
        
        ListingType listingType = type != null && !type.isBlank() 
                ? ListingType.valueOf(type.toUpperCase()) 
                : null;
        
        Page<ListingResponse> response = getNearbyListingsUseCase.execute(
                latitude, longitude, radiusKm, listingType, page, size
        );
        return ApiResponse.success(response);
    }

    @GetMapping("/my-listings")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
        summary = "Get current user's listings",
        description = "Retrieves all listings created by the authenticated user (both offers and demands)."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "User listings retrieved successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": [
                    {
                      "id": "550e8400-e29b-41d4-a716-446655440000",
                      "userId": "123e4567-e89b-12d3-a456-426614174000",
                      "title": "Fresh Organic Tomatoes",
                      "description": "Fresh organic tomatoes...",
                      "type": "OFFER",
                      "category": "Vegetables",
                      "latitude": 40.4168,
                      "longitude": -3.7038,
                      "priceAmount": 5.99,
                      "priceCurrency": "EUR",
                      "imageUrl": "/uploads/listings/123/image.jpg",
                      "active": true,
                      "distanceKm": null,
                      "createdAt": "2024-01-01T12:00:00Z"
                    }
                  ],
                  "timestamp": "2024-01-01T12:00:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    @AuthErrorResponses
    public ApiResponse<List<ListingResponse>> getMyListings(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getUserId();
        List<ListingResponse> response = getUserListingsUseCase.execute(userId);
        return ApiResponse.success(response);
    }
}
