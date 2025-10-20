package com.ecomama.modules.auth.application.usecase;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.domain.service.PasswordService;
import com.ecomama.modules.auth.infrastructure.security.JwtTokenProvider;
import com.ecomama.modules.auth.presentation.dto.AuthResponse;
import com.ecomama.modules.auth.presentation.dto.LoginRequest;
import com.ecomama.modules.auth.presentation.mapper.UserMapper;
import com.ecomama.shared.exception.UnauthorizedException;
import com.ecomama.shared.exception.ValidationException;
import com.ecomama.shared.test.fixture.UserFixture;

@ExtendWith(MockitoExtension.class)
@DisplayName("Login User Use Case Tests")
class LoginUserUseCaseTest {
    
    private static final String TEST_EMAIL = "user@example.com";
    private static final String TEST_PASSWORD = "password123";
    private static final String ACCESS_TOKEN = "access-token";
    private static final String REFRESH_TOKEN = "refresh-token";
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordService passwordService;
    
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    
    @Mock
    private UserMapper userMapper;
    
    @InjectMocks
    private LoginUserUseCase loginUserUseCase;
    
    @Captor
    private ArgumentCaptor<User> userCaptor;
    
    private LoginRequest validRequest;
    private User verifiedUser;
    
    @BeforeEach
    void setUp() {
        validRequest = new LoginRequest(TEST_EMAIL, TEST_PASSWORD);
        verifiedUser = UserFixture.aVerifiedUser().email(TEST_EMAIL).build();
    }
    
    @Nested
    @DisplayName("Successful Login")
    class SuccessfulLoginTests {
        
        @Test
        @DisplayName("Should login successfully with valid credentials")
        void shouldLoginSuccessfully() {
            when(userRepository.findByEmail(validRequest.email())).thenReturn(Optional.of(verifiedUser));
            when(passwordService.matches(anyString(), anyString())).thenReturn(true);
            when(jwtTokenProvider.generateAccessToken(any(), anyString(), anyString())).thenReturn(ACCESS_TOKEN);
            when(jwtTokenProvider.generateRefreshToken(any())).thenReturn(REFRESH_TOKEN);
            
            AuthResponse response = loginUserUseCase.execute(validRequest);
            
            assertThat(response).isNotNull();
            assertThat(response.accessToken()).isEqualTo(ACCESS_TOKEN);
            assertThat(response.refreshToken()).isEqualTo(REFRESH_TOKEN);
            
            verify(userRepository).findByEmail(validRequest.email());
            verify(passwordService).matches(anyString(), anyString());
            verify(userRepository).save(userCaptor.capture());
        }
        
        @Test
        @DisplayName("Should record login timestamp")
        void shouldRecordLoginTimestamp() {
            when(userRepository.findByEmail(validRequest.email())).thenReturn(Optional.of(verifiedUser));
            when(passwordService.matches(anyString(), anyString())).thenReturn(true);
            when(jwtTokenProvider.generateAccessToken(any(), anyString(), anyString())).thenReturn(ACCESS_TOKEN);
            when(jwtTokenProvider.generateRefreshToken(any())).thenReturn(REFRESH_TOKEN);
            
            loginUserUseCase.execute(validRequest);
            
            verify(userRepository).save(userCaptor.capture());
            User savedUser = userCaptor.getValue();
            assertThat(savedUser).isNotNull();
        }
    }
    
    @Nested
    @DisplayName("Authentication Failures")
    class AuthenticationFailureTests {
        
        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            when(userRepository.findByEmail(validRequest.email())).thenReturn(Optional.empty());
            
            assertThatThrownBy(() -> loginUserUseCase.execute(validRequest))
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessage("Invalid email or password");
            
            verify(userRepository).findByEmail(validRequest.email());
            verify(passwordService, never()).matches(anyString(), anyString());
        }
        
        @Test
        @DisplayName("Should throw exception when password is incorrect")
        void shouldThrowExceptionWhenPasswordIsIncorrect() {
            when(userRepository.findByEmail(validRequest.email())).thenReturn(Optional.of(verifiedUser));
            when(passwordService.matches(anyString(), anyString())).thenReturn(false);
            
            assertThatThrownBy(() -> loginUserUseCase.execute(validRequest))
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessage("Invalid email or password");
            
            verify(passwordService).matches(anyString(), anyString());
            verify(userRepository, never()).save(any());
        }
        
        @Test
        @DisplayName("Should throw exception when account is deactivated")
        void shouldThrowExceptionWhenAccountIsDeactivated() {
            User inactiveUser = UserFixture.aVerifiedUser().active(false).build();
            
            when(userRepository.findByEmail(validRequest.email())).thenReturn(Optional.of(inactiveUser));
            
            assertThatThrownBy(() -> loginUserUseCase.execute(validRequest))
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessage("Account is deactivated");
            
            verify(passwordService, never()).matches(anyString(), anyString());
        }
        
        @Test
        @DisplayName("Should throw exception when email is not verified")
        void shouldThrowExceptionWhenEmailNotVerified() {
            User unverifiedUser = UserFixture.anUnverifiedUser().email(TEST_EMAIL).build();
            
            when(userRepository.findByEmail(validRequest.email())).thenReturn(Optional.of(unverifiedUser));
            when(passwordService.matches(anyString(), anyString())).thenReturn(true);
            
            assertThatThrownBy(() -> loginUserUseCase.execute(validRequest))
                    .isInstanceOf(ValidationException.class)
                    .hasMessage("Please verify your email before logging in");
            
            verify(userRepository, never()).save(any());
        }
    }
}
