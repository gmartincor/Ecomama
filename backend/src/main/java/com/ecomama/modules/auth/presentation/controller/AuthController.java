package com.ecomama.modules.auth.presentation.controller;

import com.ecomama.modules.auth.application.usecase.*;
import com.ecomama.modules.auth.presentation.dto.*;
import com.ecomama.shared.api.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and registration endpoints")
public class AuthController {
    
    private final RegisterUserUseCase registerUserUseCase;
    private final LoginUserUseCase loginUserUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;
    private final VerifyEmailUseCase verifyEmailUseCase;
    
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register new user", description = "Creates a new user account and sends verification email")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = registerUserUseCase.execute(request);
        return ApiResponse.success(response);
    }
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates user and returns JWT tokens")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = loginUserUseCase.execute(request);
        return ApiResponse.success(response);
    }
    
    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh access token", description = "Generates new access token using valid refresh token")
    public ApiResponse<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = refreshTokenUseCase.execute(request);
        return ApiResponse.success(response);
    }
    
    @PostMapping("/verify-email")
    @Operation(summary = "Verify email address", description = "Verifies user email using token sent via email")
    public ApiResponse<String> verifyEmail(
            @RequestParam String email,
            @Valid @RequestBody VerifyEmailRequest request) {
        verifyEmailUseCase.execute(email, request);
        return ApiResponse.success("Email verified successfully");
    }
    
    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Invalidates current session (client should clear tokens)")
    public ApiResponse<String> logout() {
        return ApiResponse.success("Logged out successfully");
    }
}
