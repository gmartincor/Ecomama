package com.ecomama.modules.auth.application.usecase;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ecomama.modules.auth.application.service.EmailService;
import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.presentation.dto.ForgotPasswordRequest;
import com.ecomama.shared.exception.NotFoundException;
import com.ecomama.shared.test.fixture.UserFixture;

@ExtendWith(MockitoExtension.class)
@DisplayName("Forgot Password Use Case Tests")
class ForgotPasswordUseCaseTest {

    private static final String TEST_EMAIL = "user@example.com";

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ForgotPasswordUseCase forgotPasswordUseCase;

    @Captor
    private ArgumentCaptor<User> userCaptor;

    @Nested
    @DisplayName("Successful Password Reset Request")
    class SuccessfulPasswordResetRequestTests {

        @Test
        @DisplayName("Should generate reset token and send email")
        void shouldGenerateResetTokenAndSendEmail() {
            User user = UserFixture.aVerifiedUser().email(TEST_EMAIL).build();
            when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(user));
            when(userRepository.save(any(User.class))).thenReturn(user);

            ForgotPasswordRequest request = new ForgotPasswordRequest(TEST_EMAIL);
            forgotPasswordUseCase.execute(request);

            verify(userRepository).save(userCaptor.capture());
            verify(emailService).sendPasswordResetEmail(eq(TEST_EMAIL), anyString(), anyString());
        }

        @Test
        @DisplayName("Should work for verified and unverified users")
        void shouldWorkForVerifiedAndUnverifiedUsers() {
            User unverifiedUser = UserFixture.anUnverifiedUser().email(TEST_EMAIL).build();
            when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(unverifiedUser));
            when(userRepository.save(any(User.class))).thenReturn(unverifiedUser);

            ForgotPasswordRequest request = new ForgotPasswordRequest(TEST_EMAIL);
            forgotPasswordUseCase.execute(request);

            verify(userRepository).save(any(User.class));
            verify(emailService).sendPasswordResetEmail(anyString(), anyString(), anyString());
        }
    }

    @Nested
    @DisplayName("Validation Failures")
    class ValidationFailureTests {

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());

            ForgotPasswordRequest request = new ForgotPasswordRequest(TEST_EMAIL);

            assertThatThrownBy(() -> forgotPasswordUseCase.execute(request))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("User not found");

            verify(userRepository, never()).save(any());
            verify(emailService, never()).sendPasswordResetEmail(anyString(), anyString(), anyString());
        }
    }
}
