package com.ecomama.modules.auth.application.usecase;

import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.domain.service.PasswordService;
import com.ecomama.modules.auth.presentation.dto.ChangePasswordRequest;
import com.ecomama.shared.exception.NotFoundException;
import com.ecomama.shared.exception.UnauthorizedException;
import com.ecomama.shared.exception.ValidationException;
import com.ecomama.shared.test.fixture.UserFixture;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Change Password Use Case Tests")
class ChangePasswordUseCaseTest {

    private static final UUID USER_ID = UUID.randomUUID();
    private static final String CURRENT_PASSWORD = "CurrentPassword123!";
    private static final String NEW_PASSWORD = "NewSecurePassword123!";
    private static final String HASHED_PASSWORD = "hashedPassword";

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordService passwordService;

    @InjectMocks
    private ChangePasswordUseCase changePasswordUseCase;

    private User user;
    private ChangePasswordRequest validRequest;

    @BeforeEach
    void setUp() {
        user = UserFixture.aVerifiedUser().build();
        validRequest = new ChangePasswordRequest(CURRENT_PASSWORD, NEW_PASSWORD);
    }

    @Nested
    @DisplayName("Successful Password Change")
    class SuccessfulChangeTests {

        @Test
        @DisplayName("Should change password successfully with correct current password")
        void shouldChangePasswordSuccessfully() {
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
            when(passwordService.matches(anyString(), anyString())).thenReturn(true);
            doNothing().when(passwordService).validatePassword(NEW_PASSWORD);
            when(passwordService.hashPassword(NEW_PASSWORD)).thenReturn(HASHED_PASSWORD);
            when(userRepository.save(any(User.class))).thenReturn(user);

            changePasswordUseCase.execute(USER_ID, validRequest);

            verify(passwordService).matches(anyString(), anyString());
            verify(passwordService).validatePassword(NEW_PASSWORD);
            verify(passwordService).hashPassword(NEW_PASSWORD);
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("Should validate new password before changing")
        void shouldValidateNewPassword() {
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
            when(passwordService.matches(CURRENT_PASSWORD, user.getPasswordHash())).thenReturn(true);
            doNothing().when(passwordService).validatePassword(NEW_PASSWORD);
            when(passwordService.hashPassword(NEW_PASSWORD)).thenReturn(HASHED_PASSWORD);
            when(userRepository.save(any(User.class))).thenReturn(user);

            changePasswordUseCase.execute(USER_ID, validRequest);

            verify(passwordService).validatePassword(NEW_PASSWORD);
        }
    }

    @Nested
    @DisplayName("Password Change Failures")
    class ChangeFailureTests {

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            when(userRepository.findById(USER_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> changePasswordUseCase.execute(USER_ID, validRequest))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("User not found");

            verify(passwordService, never()).matches(anyString(), anyString());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw exception when current password is incorrect")
        void shouldThrowExceptionWhenCurrentPasswordIncorrect() {
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
            when(passwordService.matches(CURRENT_PASSWORD, user.getPasswordHash())).thenReturn(false);

            assertThatThrownBy(() -> changePasswordUseCase.execute(USER_ID, validRequest))
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessage("Current password is incorrect");

            verify(passwordService).matches(CURRENT_PASSWORD, user.getPasswordHash());
            verify(passwordService, never()).validatePassword(anyString());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw exception when new password is invalid")
        void shouldThrowExceptionWhenNewPasswordIsInvalid() {
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
            when(passwordService.matches(CURRENT_PASSWORD, user.getPasswordHash())).thenReturn(true);
            doThrow(new ValidationException("Password is too weak"))
                    .when(passwordService).validatePassword(NEW_PASSWORD);

            assertThatThrownBy(() -> changePasswordUseCase.execute(USER_ID, validRequest))
                    .isInstanceOf(ValidationException.class)
                    .hasMessage("Password is too weak");

            verify(passwordService).validatePassword(NEW_PASSWORD);
            verify(userRepository, never()).save(any());
        }
    }
}
