package com.ecomama.modules.auth.presentation.controller;

import com.ecomama.modules.auth.application.usecase.ChangePasswordUseCase;
import com.ecomama.modules.auth.application.usecase.ForgotPasswordUseCase;
import com.ecomama.modules.auth.application.usecase.ResetPasswordUseCase;
import com.ecomama.modules.auth.presentation.dto.ChangePasswordRequest;
import com.ecomama.modules.auth.presentation.dto.ForgotPasswordRequest;
import com.ecomama.modules.auth.presentation.dto.ResetPasswordRequest;
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
@RequestMapping("/api/v1/password")
@RequiredArgsConstructor
@Tag(name = "Password Management", description = "Password reset and change endpoints")
public class PasswordController {
    
    private final ForgotPasswordUseCase forgotPasswordUseCase;
    private final ResetPasswordUseCase resetPasswordUseCase;
    private final ChangePasswordUseCase changePasswordUseCase;
    
    @PostMapping("/forgot")
    @Operation(
        summary = "Request password reset",
        description = "Initiates the password reset process by sending a reset link to the user's registered email address."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Password reset email sent",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": "Password reset email sent",
                  "timestamp": "2024-01-01T12:00:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    public ApiResponse<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        forgotPasswordUseCase.execute(request);
        return ApiResponse.success("Password reset email sent");
    }
    
    @PostMapping("/reset")
    @Operation(
        summary = "Reset password",
        description = "Completes the password reset process using the token received via email. Sets a new password for the user account."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Password reset successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": "Password reset successfully",
                  "timestamp": "2024-01-01T12:00:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    @NotFoundResponse
    public ApiResponse<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        resetPasswordUseCase.execute(request);
        return ApiResponse.success("Password reset successfully");
    }
    
    @PostMapping("/change")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
        summary = "Change password",
        description = "Changes the password for an authenticated user. Requires the current password for verification."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "200",
        description = "Password changed successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(
                name = "Success",
                value = """
                {
                  "success": true,
                  "data": "Password changed successfully",
                  "timestamp": "2024-01-01T12:00:00Z"
                }
                """
            )
        )
    )
    @StandardErrorResponses
    @AuthErrorResponses
    public ApiResponse<String> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        UUID userId = UUID.fromString(authentication.getName());
        changePasswordUseCase.execute(userId, request);
        return ApiResponse.success("Password changed successfully");
    }
}
