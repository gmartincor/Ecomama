package com.ecomama.modules.auth.presentation.controller;

import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import org.springframework.http.MediaType;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.ecomama.modules.auth.application.usecase.ChangePasswordUseCase;
import com.ecomama.modules.auth.application.usecase.ForgotPasswordUseCase;
import com.ecomama.modules.auth.application.usecase.ResetPasswordUseCase;
import com.ecomama.modules.auth.presentation.dto.ChangePasswordRequest;
import com.ecomama.modules.auth.presentation.dto.ForgotPasswordRequest;
import com.ecomama.modules.auth.presentation.dto.ResetPasswordRequest;
import com.ecomama.shared.exception.NotFoundException;
import com.ecomama.shared.exception.UnauthorizedException;
import com.ecomama.shared.exception.ValidationException;
import com.ecomama.shared.test.BaseWebMvcTest;

@DisplayName("Password Controller Integration Tests")
class PasswordControllerTest extends BaseWebMvcTest {

    @MockitoBean
    private ForgotPasswordUseCase forgotPasswordUseCase;

    @MockitoBean
    private ResetPasswordUseCase resetPasswordUseCase;

    @MockitoBean
    private ChangePasswordUseCase changePasswordUseCase;

    @Nested
    @DisplayName("Forgot Password")
    class ForgotPasswordTests {

        @Test
        @DisplayName("Should request password reset successfully")
        void shouldRequestPasswordResetSuccessfully() throws Exception {
            ForgotPasswordRequest request = new ForgotPasswordRequest("user@example.com");
            
            doNothing().when(forgotPasswordUseCase).execute(any(ForgotPasswordRequest.class));

            mockMvc.perform(post("/api/v1/password/forgot")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data").value("Password reset email sent"));
        }

        @Test
        @DisplayName("Should return not found when user does not exist")
        void shouldReturnNotFoundWhenUserDoesNotExist() throws Exception {
            ForgotPasswordRequest request = new ForgotPasswordRequest("nonexistent@example.com");
            
            doThrow(new NotFoundException("User not found"))
                    .when(forgotPasswordUseCase).execute(any(ForgotPasswordRequest.class));

            mockMvc.perform(post("/api/v1/password/forgot")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("Should return bad request with invalid email")
        void shouldReturnBadRequestWithInvalidEmail() throws Exception {
            ForgotPasswordRequest request = new ForgotPasswordRequest("invalid-email");

            mockMvc.perform(post("/api/v1/password/forgot")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("Reset Password")
    class ResetPasswordTests {

        @Test
        @DisplayName("Should reset password successfully with valid token")
        void shouldResetPasswordSuccessfully() throws Exception {
            ResetPasswordRequest request = new ResetPasswordRequest(
                    "valid-token",
                    "NewSecurePassword123!"
            );
            
            doNothing().when(resetPasswordUseCase).execute(any(ResetPasswordRequest.class));

            mockMvc.perform(post("/api/v1/password/reset")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data").value("Password reset successfully"));
        }

        @Test
        @DisplayName("Should return bad request when token is invalid")
        void shouldReturnBadRequestWhenTokenIsInvalid() throws Exception {
            ResetPasswordRequest request = new ResetPasswordRequest(
                    "invalid-token",
                    "NewSecurePassword123!"
            );
            
            doThrow(new ValidationException("Invalid or expired reset token"))
                    .when(resetPasswordUseCase).execute(any(ResetPasswordRequest.class));

            mockMvc.perform(post("/api/v1/password/reset")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("Should return bad request with weak password")
        void shouldReturnBadRequestWithWeakPassword() throws Exception {
            ResetPasswordRequest request = new ResetPasswordRequest(
                    "valid-token",
                    "weak"
            );

            mockMvc.perform(post("/api/v1/password/reset")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("Change Password")
    class ChangePasswordTests {

        @Test
        @DisplayName("Should change password successfully for authenticated user")
        void shouldChangePasswordSuccessfully() throws Exception {
            UUID userId = UUID.randomUUID();
            ChangePasswordRequest request = new ChangePasswordRequest(
                    "CurrentPassword123!",
                    "NewSecurePassword123!"
            );
            
            doNothing().when(changePasswordUseCase).execute(eq(userId), any(ChangePasswordRequest.class));

            mockMvc.perform(post("/api/v1/password/change")
                            .with(user(userId.toString()).roles("USER"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data").value("Password changed successfully"));
        }

        @Test
        @DisplayName("Should return unauthorized when current password is incorrect")
        void shouldReturnUnauthorizedWhenCurrentPasswordIncorrect() throws Exception {
            UUID userId = UUID.randomUUID();
            ChangePasswordRequest request = new ChangePasswordRequest(
                    "WrongPassword123!",
                    "NewSecurePassword123!"
            );
            
            doThrow(new UnauthorizedException("Current password is incorrect"))
                    .when(changePasswordUseCase).execute(eq(userId), any(ChangePasswordRequest.class));

            mockMvc.perform(post("/api/v1/password/change")
                            .with(user(userId.toString()).roles("USER"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false));
        }

        @Test
        @DisplayName("Should return forbidden without authentication")
        void shouldReturnForbiddenWithoutAuth() throws Exception {
            ChangePasswordRequest request = new ChangePasswordRequest(
                    "CurrentPassword123!",
                    "NewSecurePassword123!"
            );

            mockMvc.perform(post("/api/v1/password/change")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Should return bad request with invalid data")
        void shouldReturnBadRequestWithInvalidData() throws Exception {
            UUID userId = UUID.randomUUID();
            ChangePasswordRequest request = new ChangePasswordRequest("", "");

            mockMvc.perform(post("/api/v1/password/change")
                            .with(user(userId.toString()).roles("USER"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isBadRequest());
        }
    }
}
