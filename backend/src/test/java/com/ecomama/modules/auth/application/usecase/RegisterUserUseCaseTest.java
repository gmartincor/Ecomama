package com.ecomama.modules.auth.application.usecase;

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
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ecomama.modules.auth.application.service.EmailService;
import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.domain.service.PasswordService;
import com.ecomama.modules.auth.infrastructure.security.JwtTokenProvider;
import com.ecomama.modules.auth.presentation.dto.AuthResponse;
import com.ecomama.modules.auth.presentation.dto.RegisterRequest;
import com.ecomama.modules.auth.presentation.mapper.UserMapper;
import com.ecomama.shared.exception.ConflictException;
import com.ecomama.shared.exception.ValidationException;
import com.ecomama.shared.test.fixture.UserFixture;

@ExtendWith(MockitoExtension.class)
@DisplayName("Register User Use Case Tests")
class RegisterUserUseCaseTest {
    
    private static final String TEST_EMAIL = "newuser@example.com";
    private static final String TEST_PASSWORD = "SecurePassword123!";
    private static final String TEST_FIRST_NAME = "John";
    private static final String TEST_LAST_NAME = "Doe";
    private static final String HASHED_PASSWORD = "hashedPassword";
    private static final String ACCESS_TOKEN = "access-token";
    private static final String REFRESH_TOKEN = "refresh-token";
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordService passwordService;
    
    @Mock
    private EmailService emailService;
    
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    
    @Mock
    private UserMapper userMapper;
    
    @InjectMocks
    private RegisterUserUseCase registerUserUseCase;
    
    @Captor
    private ArgumentCaptor<User> userCaptor;
    
    private RegisterRequest validRequest;
    
    @BeforeEach
    void setUp() {
        validRequest = new RegisterRequest(
                TEST_EMAIL,
                TEST_PASSWORD,
                TEST_FIRST_NAME,
                TEST_LAST_NAME,
                "en"
        );
    }
    
    @Nested
    @DisplayName("Successful Registration")
    class SuccessfulRegistrationTests {
        
        @Test
        @DisplayName("Should register user successfully with valid data")
        void shouldRegisterUserSuccessfully() {
            when(userRepository.existsByEmail(validRequest.email())).thenReturn(false);
            doNothing().when(passwordService).validatePassword(validRequest.password());
            when(passwordService.hashPassword(validRequest.password())).thenReturn(HASHED_PASSWORD);
            
            User savedUser = UserFixture.anUnverifiedUser().email(TEST_EMAIL).build();
            when(userRepository.save(any(User.class))).thenReturn(savedUser);
            when(jwtTokenProvider.generateAccessToken(any(), anyString(), anyString())).thenReturn(ACCESS_TOKEN);
            when(jwtTokenProvider.generateRefreshToken(any())).thenReturn(REFRESH_TOKEN);
            
            AuthResponse response = registerUserUseCase.execute(validRequest);
            
            assertThat(response).isNotNull();
            assertThat(response.accessToken()).isEqualTo(ACCESS_TOKEN);
            assertThat(response.refreshToken()).isEqualTo(REFRESH_TOKEN);
            
            verify(userRepository).existsByEmail(validRequest.email());
            verify(passwordService).validatePassword(validRequest.password());
            verify(passwordService).hashPassword(validRequest.password());
            verify(userRepository).save(userCaptor.capture());
            verify(emailService).sendVerificationEmail(anyString(), anyString(), anyString(), anyString());
        }
        
        @Test
        @DisplayName("Should create user with correct profile information")
        void shouldCreateUserWithCorrectProfile() {
            when(userRepository.existsByEmail(validRequest.email())).thenReturn(false);
            doNothing().when(passwordService).validatePassword(validRequest.password());
            when(passwordService.hashPassword(validRequest.password())).thenReturn(HASHED_PASSWORD);
            
            User savedUser = UserFixture.anUnverifiedUser().email(TEST_EMAIL).build();
            when(userRepository.save(any(User.class))).thenReturn(savedUser);
            when(jwtTokenProvider.generateAccessToken(any(), anyString(), anyString())).thenReturn(ACCESS_TOKEN);
            when(jwtTokenProvider.generateRefreshToken(any())).thenReturn(REFRESH_TOKEN);
            
            registerUserUseCase.execute(validRequest);
            
            verify(userRepository).save(userCaptor.capture());
            User capturedUser = userCaptor.getValue();
            
            assertThat(capturedUser).isNotNull();
        }
        
        @Test
        @DisplayName("Should send verification email after registration")
        void shouldSendVerificationEmail() {
            when(userRepository.existsByEmail(validRequest.email())).thenReturn(false);
            doNothing().when(passwordService).validatePassword(validRequest.password());
            when(passwordService.hashPassword(validRequest.password())).thenReturn(HASHED_PASSWORD);
            
            User savedUser = UserFixture.anUnverifiedUser()
                    .email(TEST_EMAIL)
                    .build();
            when(userRepository.save(any(User.class))).thenReturn(savedUser);
            when(jwtTokenProvider.generateAccessToken(any(), anyString(), anyString())).thenReturn(ACCESS_TOKEN);
            when(jwtTokenProvider.generateRefreshToken(any())).thenReturn(REFRESH_TOKEN);
            
            registerUserUseCase.execute(validRequest);
            
            verify(emailService).sendVerificationEmail(
                    eq(TEST_EMAIL),
                    eq(TEST_FIRST_NAME),
                    anyString(),
                    anyString()
            );
        }
    }
    
    @Nested
    @DisplayName("Validation Failures")
    class ValidationFailureTests {
        
        @Test
        @DisplayName("Should throw exception when email already exists")
        void shouldThrowExceptionWhenEmailExists() {
            when(userRepository.existsByEmail(validRequest.email())).thenReturn(true);
            
            assertThatThrownBy(() -> registerUserUseCase.execute(validRequest))
                    .isInstanceOf(ConflictException.class)
                    .hasMessage("Email already registered");
            
            verify(userRepository).existsByEmail(validRequest.email());
            verify(userRepository, never()).save(any());
            verify(emailService, never()).sendVerificationEmail(anyString(), anyString(), anyString(), anyString());
        }
        
        @Test
        @DisplayName("Should throw exception when password is invalid")
        void shouldThrowExceptionWhenPasswordIsInvalid() {
            when(userRepository.existsByEmail(validRequest.email())).thenReturn(false);
            doThrow(new ValidationException("Password is too weak"))
                    .when(passwordService).validatePassword(validRequest.password());
            
            assertThatThrownBy(() -> registerUserUseCase.execute(validRequest))
                    .isInstanceOf(ValidationException.class)
                    .hasMessage("Password is too weak");
            
            verify(passwordService).validatePassword(validRequest.password());
            verify(userRepository, never()).save(any());
        }
    }
}
