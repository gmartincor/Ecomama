package com.ecomama.modules.auth.application.usecase;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.domain.service.PasswordService;
import com.ecomama.modules.auth.presentation.dto.ResetPasswordRequest;
import com.ecomama.shared.exception.ValidationException;
import com.ecomama.shared.test.fixture.UserFixture;

@ExtendWith(MockitoExtension.class)
@DisplayName("Reset Password Use Case Tests")
class ResetPasswordUseCaseTest {

    private static final String VALID_TOKEN = "valid-reset-token";
    private static final String INVALID_TOKEN = "invalid-token";
    private static final String NEW_PASSWORD = "NewSecurePassword123!";
    private static final String HASHED_PASSWORD = "hashedPassword";

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordService passwordService;

    @InjectMocks
    private ResetPasswordUseCase resetPasswordUseCase;

    @Nested
    @DisplayName("Successful Password Reset")
    class SuccessfulResetTests {

        @Test
        @DisplayName("Should reset password successfully with valid token")
        void shouldResetPasswordSuccessfully() {
            User user = UserFixture.aVerifiedUser().build();
            user.setPasswordResetToken(VALID_TOKEN, Instant.now().plus(1, ChronoUnit.HOURS));
            
            when(userRepository.findByPasswordResetToken(VALID_TOKEN)).thenReturn(Optional.of(user));
            doNothing().when(passwordService).validatePassword(NEW_PASSWORD);
            when(passwordService.hashPassword(NEW_PASSWORD)).thenReturn(HASHED_PASSWORD);
            when(userRepository.save(any(User.class))).thenReturn(user);

            ResetPasswordRequest request = new ResetPasswordRequest(VALID_TOKEN, NEW_PASSWORD);
            resetPasswordUseCase.execute(request);

            verify(passwordService).validatePassword(NEW_PASSWORD);
            verify(passwordService).hashPassword(NEW_PASSWORD);
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("Should validate new password before resetting")
        void shouldValidateNewPassword() {
            User user = UserFixture.aVerifiedUser().build();
            user.setPasswordResetToken(VALID_TOKEN, Instant.now().plus(1, ChronoUnit.HOURS));
            
            when(userRepository.findByPasswordResetToken(VALID_TOKEN)).thenReturn(Optional.of(user));
            doNothing().when(passwordService).validatePassword(NEW_PASSWORD);
            when(passwordService.hashPassword(NEW_PASSWORD)).thenReturn(HASHED_PASSWORD);
            when(userRepository.save(any(User.class))).thenReturn(user);

            ResetPasswordRequest request = new ResetPasswordRequest(VALID_TOKEN, NEW_PASSWORD);
            resetPasswordUseCase.execute(request);

            verify(passwordService).validatePassword(NEW_PASSWORD);
        }
    }

    @Nested
    @DisplayName("Password Reset Failures")
    class ResetFailureTests {

        @Test
        @DisplayName("Should throw exception when token not found")
        void shouldThrowExceptionWhenTokenNotFound() {
            when(userRepository.findByPasswordResetToken(INVALID_TOKEN)).thenReturn(Optional.empty());

            ResetPasswordRequest request = new ResetPasswordRequest(INVALID_TOKEN, NEW_PASSWORD);

            assertThatThrownBy(() -> resetPasswordUseCase.execute(request))
                    .isInstanceOf(ValidationException.class)
                    .hasMessage("Invalid or expired reset token");

            verify(passwordService, never()).validatePassword(anyString());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw exception when token has expired")
        void shouldThrowExceptionWhenTokenExpired() {
            User user = UserFixture.aVerifiedUser().build();
            user.setPasswordResetToken(VALID_TOKEN, Instant.now().minus(1, ChronoUnit.HOURS));
            
            when(userRepository.findByPasswordResetToken(VALID_TOKEN)).thenReturn(Optional.of(user));

            ResetPasswordRequest request = new ResetPasswordRequest(VALID_TOKEN, NEW_PASSWORD);

            assertThatThrownBy(() -> resetPasswordUseCase.execute(request))
                    .isInstanceOf(ValidationException.class)
                    .hasMessage("Invalid or expired reset token");

            verify(passwordService, never()).validatePassword(anyString());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw exception when password is invalid")
        void shouldThrowExceptionWhenPasswordIsInvalid() {
            User user = UserFixture.aVerifiedUser().build();
            user.setPasswordResetToken(VALID_TOKEN, Instant.now().plus(1, ChronoUnit.HOURS));
            
            when(userRepository.findByPasswordResetToken(VALID_TOKEN)).thenReturn(Optional.of(user));
            doThrow(new ValidationException("Password is too weak"))
                    .when(passwordService).validatePassword(NEW_PASSWORD);

            ResetPasswordRequest request = new ResetPasswordRequest(VALID_TOKEN, NEW_PASSWORD);

            assertThatThrownBy(() -> resetPasswordUseCase.execute(request))
                    .isInstanceOf(ValidationException.class)
                    .hasMessage("Password is too weak");

            verify(passwordService).validatePassword(NEW_PASSWORD);
            verify(userRepository, never()).save(any());
        }
    }
}
