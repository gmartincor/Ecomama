package com.ecomama.modules.auth.presentation.controller;

import com.ecomama.modules.auth.application.usecase.GetProfileUseCase;
import com.ecomama.modules.auth.application.usecase.UpdateProfileUseCase;
import com.ecomama.modules.auth.infrastructure.security.CustomUserDetails;
import com.ecomama.modules.auth.presentation.dto.UpdateProfileRequest;
import com.ecomama.modules.auth.presentation.dto.UserResponse;
import com.ecomama.shared.api.ApiResponse;
import com.ecomama.shared.api.doc.ApiDocumentation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "User Profile", description = "User profile management endpoints")
public class UserController {
    
    private final GetProfileUseCase getProfileUseCase;
    private final UpdateProfileUseCase updateProfileUseCase;
    
    @GetMapping("/me")
    @Operation(
        summary = "Get current user profile",
        description = "Retrieves complete profile information for the authenticated user including personal details and account settings."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Profile retrieved successfully",
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
                    "email": "farmer@example.com",
                    "role": "USER",
                    "emailVerified": true,
                    "profile": {
                      "firstName": "John",
                      "lastName": "Doe",
                      "phoneNumber": "+1234567890",
                      "bio": "Organic farmer with 10 years of experience",
                      "city": "Barcelona",
                      "country": "Spain"
                    },
                    "createdAt": "2024-01-01T12:00:00Z",
                    "lastLoginAt": "2024-01-15T08:30:00Z"
                  },
                  "timestamp": "2024-01-15T08:30:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    @AuthErrorResponses
    public ApiResponse<UserResponse> getProfile(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getUserId();
        UserResponse response = getProfileUseCase.execute(userId);
        return ApiResponse.success(response);
    }
    
    @PutMapping("/profile")
    @Operation(
        summary = "Update user profile",
        description = "Updates profile information for the authenticated user. All fields are optional - only provided fields will be updated."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Profile updated successfully",
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
                    "email": "farmer@example.com",
                    "role": "USER",
                    "emailVerified": true,
                    "profile": {
                      "firstName": "John",
                      "lastName": "Doe",
                      "phoneNumber": "+1234567890",
                      "bio": "Updated bio text",
                      "city": "Madrid",
                      "country": "Spain"
                    },
                    "createdAt": "2024-01-01T12:00:00Z",
                    "lastLoginAt": "2024-01-15T08:30:00Z"
                  },
                  "timestamp": "2024-01-15T08:30:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    @AuthErrorResponses
    public ApiResponse<UserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getUserId();
        UserResponse response = updateProfileUseCase.execute(userId, request);
        return ApiResponse.success(response);
    }
}
