package com.ecomama.modules.auth.presentation.controller;

import com.ecomama.modules.auth.application.usecase.ChangePasswordUseCase;
import com.ecomama.modules.auth.application.usecase.ForgotPasswordUseCase;
import com.ecomama.modules.auth.application.usecase.ResetPasswordUseCase;
import com.ecomama.modules.auth.presentation.dto.ChangePasswordRequest;
import com.ecomama.modules.auth.presentation.dto.ForgotPasswordRequest;
import com.ecomama.modules.auth.presentation.dto.ResetPasswordRequest;
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
@RequestMapping("/api/v1/password")
@RequiredArgsConstructor
@Tag(name = "Password Management", description = "Password reset and change endpoints")
public class PasswordController {
    
    private final ForgotPasswordUseCase forgotPasswordUseCase;
    private final ResetPasswordUseCase resetPasswordUseCase;
    private final ChangePasswordUseCase changePasswordUseCase;
    
    @PostMapping("/forgot")
    @Operation(summary = "Request password reset", description = "Sends password reset email to user")
    public ApiResponse<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        forgotPasswordUseCase.execute(request);
        return ApiResponse.success("Password reset email sent");
    }
    
    @PostMapping("/reset")
    @Operation(summary = "Reset password", description = "Resets password using token from email")
    public ApiResponse<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        resetPasswordUseCase.execute(request);
        return ApiResponse.success("Password reset successfully");
    }
    
    @PostMapping("/change")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Change password", description = "Changes password for authenticated user")
    public ApiResponse<String> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        UUID userId = UUID.fromString(authentication.getName());
        changePasswordUseCase.execute(userId, request);
        return ApiResponse.success("Password changed successfully");
    }
}
