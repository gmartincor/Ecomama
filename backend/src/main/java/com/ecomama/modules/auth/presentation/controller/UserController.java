package com.ecomama.modules.auth.presentation.controller;

import com.ecomama.modules.auth.application.usecase.GetProfileUseCase;
import com.ecomama.modules.auth.application.usecase.UpdateProfileUseCase;
import com.ecomama.modules.auth.infrastructure.security.CustomUserDetails;
import com.ecomama.modules.auth.presentation.dto.UpdateProfileRequest;
import com.ecomama.modules.auth.presentation.dto.UserResponse;
import com.ecomama.shared.api.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(summary = "Get current user profile", description = "Returns authenticated user's profile information")
    public ApiResponse<UserResponse> getProfile(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getUserId();
        UserResponse response = getProfileUseCase.execute(userId);
        return ApiResponse.success(response);
    }
    
    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Updates authenticated user's profile information")
    public ApiResponse<UserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getUserId();
        UserResponse response = updateProfileUseCase.execute(userId, request);
        return ApiResponse.success(response);
    }
}
