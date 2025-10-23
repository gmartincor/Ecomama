package com.ecomama.modules.auth.application.usecase;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
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

import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.infrastructure.security.JwtTokenProvider;
import com.ecomama.modules.auth.presentation.dto.AuthResponse;
import com.ecomama.modules.auth.presentation.dto.RefreshTokenRequest;
import com.ecomama.modules.auth.presentation.mapper.UserMapper;
import com.ecomama.shared.exception.UnauthorizedException;
import com.ecomama.shared.test.fixture.UserFixture;

@ExtendWith(MockitoExtension.class)
@DisplayName("Refresh Token Use Case Tests")
class RefreshTokenUseCaseTest {

    private static final String VALID_REFRESH_TOKEN = "valid-refresh-token";
    private static final String INVALID_REFRESH_TOKEN = "invalid-refresh-token";
    private static final String NEW_ACCESS_TOKEN = "new-access-token";
    private static final String NEW_REFRESH_TOKEN = "new-refresh-token";
    private static final UUID USER_ID = UUID.randomUUID();

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private RefreshTokenUseCase refreshTokenUseCase;

    private User activeUser;
    private RefreshTokenRequest validRequest;

    @BeforeEach
    void setUp() {
        activeUser = UserFixture.aVerifiedUser().build();
        validRequest = new RefreshTokenRequest(VALID_REFRESH_TOKEN);
    }

    @Nested
    @DisplayName("Successful Token Refresh")
    class SuccessfulRefreshTests {

        @Test
        @DisplayName("Should refresh tokens successfully with valid refresh token")
        void shouldRefreshTokensSuccessfully() {
            when(jwtTokenProvider.validateRefreshToken(VALID_REFRESH_TOKEN)).thenReturn(true);
            when(jwtTokenProvider.getUserIdFromToken(VALID_REFRESH_TOKEN)).thenReturn(USER_ID);
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(activeUser));
            when(jwtTokenProvider.generateAccessToken(any(), anyString(), anyString())).thenReturn(NEW_ACCESS_TOKEN);
            when(jwtTokenProvider.generateRefreshToken(any())).thenReturn(NEW_REFRESH_TOKEN);

            AuthResponse response = refreshTokenUseCase.execute(validRequest);

            assertThat(response).isNotNull();
            assertThat(response.accessToken()).isEqualTo(NEW_ACCESS_TOKEN);
            assertThat(response.refreshToken()).isEqualTo(NEW_REFRESH_TOKEN);

            verify(jwtTokenProvider).validateRefreshToken(VALID_REFRESH_TOKEN);
            verify(jwtTokenProvider).getUserIdFromToken(VALID_REFRESH_TOKEN);
            verify(userRepository).findById(USER_ID);
            verify(jwtTokenProvider).generateAccessToken(any(), anyString(), anyString());
            verify(jwtTokenProvider).generateRefreshToken(any());
        }

        @Test
        @DisplayName("Should map user to response")
        void shouldMapUserToResponse() {
            when(jwtTokenProvider.validateRefreshToken(VALID_REFRESH_TOKEN)).thenReturn(true);
            when(jwtTokenProvider.getUserIdFromToken(VALID_REFRESH_TOKEN)).thenReturn(USER_ID);
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(activeUser));
            when(jwtTokenProvider.generateAccessToken(any(), anyString(), anyString())).thenReturn(NEW_ACCESS_TOKEN);
            when(jwtTokenProvider.generateRefreshToken(any())).thenReturn(NEW_REFRESH_TOKEN);

            refreshTokenUseCase.execute(validRequest);

            verify(userMapper).toUserResponse(activeUser);
        }
    }

    @Nested
    @DisplayName("Token Refresh Failures")
    class RefreshFailureTests {

        @Test
        @DisplayName("Should throw exception when refresh token is invalid")
        void shouldThrowExceptionWhenRefreshTokenIsInvalid() {
            when(jwtTokenProvider.validateRefreshToken(INVALID_REFRESH_TOKEN)).thenReturn(false);

            RefreshTokenRequest request = new RefreshTokenRequest(INVALID_REFRESH_TOKEN);

            assertThatThrownBy(() -> refreshTokenUseCase.execute(request))
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessage("Invalid or expired refresh token");

            verify(jwtTokenProvider).validateRefreshToken(INVALID_REFRESH_TOKEN);
            verify(userRepository, never()).findById(any());
            verify(jwtTokenProvider, never()).generateAccessToken(any(), anyString(), anyString());
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            when(jwtTokenProvider.validateRefreshToken(VALID_REFRESH_TOKEN)).thenReturn(true);
            when(jwtTokenProvider.getUserIdFromToken(VALID_REFRESH_TOKEN)).thenReturn(USER_ID);
            when(userRepository.findById(USER_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> refreshTokenUseCase.execute(validRequest))
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessage("User not found");

            verify(jwtTokenProvider, never()).generateAccessToken(any(), anyString(), anyString());
        }

        @Test
        @DisplayName("Should throw exception when account is deactivated")
        void shouldThrowExceptionWhenAccountIsDeactivated() {
            User inactiveUser = UserFixture.aVerifiedUser().active(false).build();
            
            when(jwtTokenProvider.validateRefreshToken(VALID_REFRESH_TOKEN)).thenReturn(true);
            when(jwtTokenProvider.getUserIdFromToken(VALID_REFRESH_TOKEN)).thenReturn(USER_ID);
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(inactiveUser));

            assertThatThrownBy(() -> refreshTokenUseCase.execute(validRequest))
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessage("Account is deactivated");

            verify(jwtTokenProvider, never()).generateAccessToken(any(), anyString(), anyString());
        }
    }
}
