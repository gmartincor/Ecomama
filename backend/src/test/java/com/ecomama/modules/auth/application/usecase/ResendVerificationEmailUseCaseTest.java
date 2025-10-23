package com.ecomama.modules.auth.application.usecase;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ecomama.modules.auth.application.service.EmailService;
import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.shared.exception.NotFoundException;
import com.ecomama.shared.exception.ValidationException;
import com.ecomama.shared.test.fixture.UserFixture;

@ExtendWith(MockitoExtension.class)
@DisplayName("Resend Verification Email Use Case Tests")
class ResendVerificationEmailUseCaseTest {

    private static final UUID USER_ID = UUID.randomUUID();

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ResendVerificationEmailUseCase resendVerificationEmailUseCase;

    @Nested
    @DisplayName("Successful Email Resend")
    class SuccessfulResendTests {

        @Test
        @DisplayName("Should resend verification email for unverified user")
        void shouldResendVerificationEmail() {
            User user = UserFixture.anUnverifiedUser().build();
            
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
            when(userRepository.save(any(User.class))).thenReturn(user);

            resendVerificationEmailUseCase.execute(USER_ID);

            verify(userRepository).save(any(User.class));
            verify(emailService).sendVerificationEmail(anyString(), anyString(), anyString(), anyString());
        }

        @Test
        @DisplayName("Should generate new verification token when resending")
        void shouldGenerateNewToken() {
            User user = UserFixture.anUnverifiedUser().build();
            
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
            when(userRepository.save(any(User.class))).thenReturn(user);

            resendVerificationEmailUseCase.execute(USER_ID);

            verify(userRepository).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("Resend Failures")
    class ResendFailureTests {

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            when(userRepository.findById(USER_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> resendVerificationEmailUseCase.execute(USER_ID))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("User not found");

            verify(userRepository, never()).save(any());
            verify(emailService, never()).sendVerificationEmail(anyString(), anyString(), anyString(), anyString());
        }

        @Test
        @DisplayName("Should throw exception when email already verified")
        void shouldThrowExceptionWhenEmailAlreadyVerified() {
            User user = UserFixture.aVerifiedUser().build();
            
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));

            assertThatThrownBy(() -> resendVerificationEmailUseCase.execute(USER_ID))
                    .isInstanceOf(ValidationException.class)
                    .hasMessage("Email is already verified");

            verify(userRepository, never()).save(any());
            verify(emailService, never()).sendVerificationEmail(anyString(), anyString(), anyString(), anyString());
        }

        @Test
        @DisplayName("Should throw exception when account is deactivated")
        void shouldThrowExceptionWhenAccountDeactivated() {
            User user = UserFixture.anUnverifiedUser().active(false).build();
            
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));

            assertThatThrownBy(() -> resendVerificationEmailUseCase.execute(USER_ID))
                    .isInstanceOf(ValidationException.class)
                    .hasMessage("Account is deactivated");

            verify(userRepository, never()).save(any());
            verify(emailService, never()).sendVerificationEmail(anyString(), anyString(), anyString(), anyString());
        }
    }
}
