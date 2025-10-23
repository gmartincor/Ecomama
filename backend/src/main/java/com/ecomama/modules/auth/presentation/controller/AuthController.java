package com.ecomama.modules.auth.presentation.controller;

import com.ecomama.modules.auth.application.usecase.*;
import com.ecomama.modules.auth.infrastructure.security.CustomUserDetails;
import com.ecomama.modules.auth.presentation.dto.*;
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
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and registration endpoints")
public class AuthController {
    
    private final RegisterUserUseCase registerUserUseCase;
    private final LoginUserUseCase loginUserUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;
    private final VerifyEmailUseCase verifyEmailUseCase;
    private final ResendVerificationEmailUseCase resendVerificationEmailUseCase;
    
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Register new user",
        description = "Creates a new user account and sends email verification link. The user must verify their email before accessing protected features."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "201",
        description = "User registered successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": {
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
                    "user": {
                      "id": "550e8400-e29b-41d4-a716-446655440000",
                      "email": "farmer@example.com",
                      "role": "USER",
                      "emailVerified": false,
                      "profile": {
                        "firstName": "John",
                        "lastName": "Doe"
                      },
                      "createdAt": "2024-01-01T12:00:00Z"
                    }
                  },
                  "timestamp": "2024-01-01T12:00:00Z"
                }
                """
            )
        )
    )
    @ConflictResponse
    @StandardErrorResponses
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = registerUserUseCase.execute(request);
        return ApiResponse.success(response);
    }
    
    @PostMapping("/login")
    @Operation(
        summary = "User login",
        description = "Authenticates user credentials and returns JWT access token and refresh token. Use the access token in the Authorization header for subsequent requests."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Login successful",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": {
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
                    "user": {
                      "id": "550e8400-e29b-41d4-a716-446655440000",
                      "email": "farmer@example.com",
                      "role": "USER",
                      "emailVerified": true,
                      "lastLoginAt": "2024-01-15T08:30:00Z"
                    }
                  },
                  "timestamp": "2024-01-15T08:30:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    @AuthErrorResponses
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = loginUserUseCase.execute(request);
        return ApiResponse.success(response);
    }
    
    @PostMapping("/refresh-token")
    @Operation(
        summary = "Refresh access token",
        description = "Generates a new access token using a valid refresh token. Use this when the access token expires."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Token refreshed successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": {
                    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
                    "user": {
                      "id": "550e8400-e29b-41d4-a716-446655440000",
                      "email": "farmer@example.com"
                    }
                  },
                  "timestamp": "2024-01-15T08:30:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    @AuthErrorResponses
    public ApiResponse<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = refreshTokenUseCase.execute(request);
        return ApiResponse.success(response);
    }
    
    @PostMapping("/verify-email")
    @Operation(
        summary = "Verify email address",
        description = "Verifies user email using the verification token received via email. This activates email-verified features."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Email verified successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": "Email verified successfully",
                  "timestamp": "2024-01-01T12:00:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    public ApiResponse<String> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        verifyEmailUseCase.execute(request);
        return ApiResponse.success("Email verified successfully");
    }
    
    @PostMapping("/resend-verification")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
        summary = "Resend verification email",
        description = "Sends a new verification email to the authenticated user. Use this if the original verification email was lost or expired."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Verification email sent",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": "Verification email sent successfully",
                  "timestamp": "2024-01-01T12:00:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    @AuthErrorResponses
    public ApiResponse<String> resendVerificationEmail(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getUserId();
        resendVerificationEmailUseCase.execute(userId);
        return ApiResponse.success("Verification email sent successfully");
    }
    
    @PostMapping("/logout")
    @Operation(
        summary = "Logout user",
        description = "Logs out the current user. Client applications should clear stored tokens after calling this endpoint."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Logout successful",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": "Logged out successfully",
                  "timestamp": "2024-01-01T12:00:00Z"
                }
                """
            )
        )
    )
    public ApiResponse<String> logout() {
        return ApiResponse.success("Logged out successfully");
    }
}
