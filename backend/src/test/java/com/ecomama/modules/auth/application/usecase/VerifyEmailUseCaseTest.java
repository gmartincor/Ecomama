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
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ecomama.modules.auth.application.service.EmailService;
import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.presentation.dto.VerifyEmailRequest;
import com.ecomama.shared.exception.ValidationException;
import com.ecomama.shared.test.fixture.UserFixture;

@ExtendWith(MockitoExtension.class)
@DisplayName("Verify Email Use Case Tests")
class VerifyEmailUseCaseTest {

    private static final String VALID_TOKEN = "valid-verification-token";
    private static final String INVALID_TOKEN = "invalid-token";

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private VerifyEmailUseCase verifyEmailUseCase;

    @Nested
    @DisplayName("Successful Email Verification")
    class SuccessfulVerificationTests {

        @Test
        @DisplayName("Should verify email successfully with valid token")
        void shouldVerifyEmailSuccessfully() {
            User user = UserFixture.anUnverifiedUser().build();
            user.setEmailVerificationToken(VALID_TOKEN, Instant.now().plus(24, ChronoUnit.HOURS));
            
            when(userRepository.findByEmailVerificationToken(VALID_TOKEN)).thenReturn(Optional.of(user));
            when(userRepository.save(any(User.class))).thenReturn(user);

            VerifyEmailRequest request = new VerifyEmailRequest(VALID_TOKEN);
            verifyEmailUseCase.execute(request);

            verify(userRepository).save(any(User.class));
            verify(emailService).sendWelcomeEmail(anyString(), anyString(), anyString());
        }

        @Test
        @DisplayName("Should send welcome email after verification")
        void shouldSendWelcomeEmail() {
            User user = UserFixture.anUnverifiedUser().email("user@example.com").build();
            user.setEmailVerificationToken(VALID_TOKEN, Instant.now().plus(24, ChronoUnit.HOURS));
            
            when(userRepository.findByEmailVerificationToken(VALID_TOKEN)).thenReturn(Optional.of(user));
            when(userRepository.save(any(User.class))).thenReturn(user);

            VerifyEmailRequest request = new VerifyEmailRequest(VALID_TOKEN);
            verifyEmailUseCase.execute(request);

            verify(emailService).sendWelcomeEmail(
                eq("user@example.com"),
                anyString(),
                anyString()
            );
        }

        @Test
        @DisplayName("Should save user after successful verification")
        void shouldSaveUserAfterVerification() {
            User user = UserFixture.anUnverifiedUser().build();
            user.setEmailVerificationToken(VALID_TOKEN, Instant.now().plus(24, ChronoUnit.HOURS));
            
            when(userRepository.findByEmailVerificationToken(VALID_TOKEN)).thenReturn(Optional.of(user));
            when(userRepository.save(any(User.class))).thenReturn(user);

            VerifyEmailRequest request = new VerifyEmailRequest(VALID_TOKEN);
            verifyEmailUseCase.execute(request);

            verify(userRepository).save(any(User.class));
            verify(emailService).sendWelcomeEmail(anyString(), anyString(), anyString());
        }
    }

    @Nested
    @DisplayName("Verification Failures")
    class VerificationFailureTests {

        @Test
        @DisplayName("Should throw exception when token not found")
        void shouldThrowExceptionWhenTokenNotFound() {
            when(userRepository.findByEmailVerificationToken(INVALID_TOKEN)).thenReturn(Optional.empty());

            VerifyEmailRequest request = new VerifyEmailRequest(INVALID_TOKEN);

            assertThatThrownBy(() -> verifyEmailUseCase.execute(request))
                    .isInstanceOf(ValidationException.class)
                    .hasMessage("Invalid or expired verification token");

            verify(userRepository, never()).save(any());
            verify(emailService, never()).sendWelcomeEmail(anyString(), anyString(), anyString());
        }

        @Test
        @DisplayName("Should throw exception when email already verified")
        void shouldThrowExceptionWhenEmailAlreadyVerified() {
            User user = UserFixture.aVerifiedUser().build();
            
            when(userRepository.findByEmailVerificationToken(VALID_TOKEN)).thenReturn(Optional.of(user));

            VerifyEmailRequest request = new VerifyEmailRequest(VALID_TOKEN);

            assertThatThrownBy(() -> verifyEmailUseCase.execute(request))
                    .isInstanceOf(ValidationException.class)
                    .hasMessage("Email is already verified");

            verify(userRepository, never()).save(any());
            verify(emailService, never()).sendWelcomeEmail(anyString(), anyString(), anyString());
        }

        @Test
        @DisplayName("Should throw exception when token has expired")
        void shouldThrowExceptionWhenTokenExpired() {
            User user = UserFixture.anUnverifiedUser().build();
            user.setEmailVerificationToken(VALID_TOKEN, Instant.now().minus(1, ChronoUnit.HOURS));
            
            when(userRepository.findByEmailVerificationToken(VALID_TOKEN)).thenReturn(Optional.of(user));

            VerifyEmailRequest request = new VerifyEmailRequest(VALID_TOKEN);

            assertThatThrownBy(() -> verifyEmailUseCase.execute(request))
                    .isInstanceOf(ValidationException.class)
                    .hasMessage("Verification token has expired");

            verify(userRepository, never()).save(any());
            verify(emailService, never()).sendWelcomeEmail(anyString(), anyString(), anyString());
        }
    }
}
