package com.ecomama.modules.auth.presentation.controller;

import java.time.Instant;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.ecomama.modules.auth.application.usecase.LoginUserUseCase;
import com.ecomama.modules.auth.application.usecase.RefreshTokenUseCase;
import com.ecomama.modules.auth.application.usecase.RegisterUserUseCase;
import com.ecomama.modules.auth.application.usecase.VerifyEmailUseCase;
import com.ecomama.modules.auth.presentation.dto.AuthResponse;
import com.ecomama.modules.auth.presentation.dto.LoginRequest;
import com.ecomama.modules.auth.presentation.dto.ProfileResponse;
import com.ecomama.modules.auth.presentation.dto.RefreshTokenRequest;
import com.ecomama.modules.auth.presentation.dto.RegisterRequest;
import com.ecomama.modules.auth.presentation.dto.UserResponse;
import com.ecomama.shared.exception.ConflictException;
import com.ecomama.shared.exception.UnauthorizedException;
import com.ecomama.shared.test.BaseWebMvcTest;

@DisplayName("Auth Controller Integration Tests")
class AuthControllerTest extends BaseWebMvcTest {
    
    @MockitoBean
    private RegisterUserUseCase registerUserUseCase;
    
    @MockitoBean
    private LoginUserUseCase loginUserUseCase;
    
    @MockitoBean
    private RefreshTokenUseCase refreshTokenUseCase;
    
    @MockitoBean
    private VerifyEmailUseCase verifyEmailUseCase;
    
    @Nested
    @DisplayName("Registration")
    class RegistrationTests {
        
        @Test
        @DisplayName("Should register user successfully")
        void shouldRegisterUserSuccessfully() throws Exception {
            RegisterRequest request = new RegisterRequest(
                    "newuser@example.com",
                    "SecurePassword123!",
                    "John",
                    "Doe"
            );
            
            ProfileResponse profileResponse = new ProfileResponse(
                    "John",
                    "Doe",
                    null,
                    null,
                    null,
                    null,
                    null
            );
            
            UserResponse userResponse = new UserResponse(
                    UUID.randomUUID(),
                    "newuser@example.com",
                    "USER",
                    false,
                    profileResponse,
                    Instant.now(),
                    null
            );
            
            AuthResponse response = new AuthResponse(
                    "access-token",
                    "refresh-token",
                    userResponse
            );
            
            when(registerUserUseCase.execute(any(RegisterRequest.class))).thenReturn(response);
            
            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.accessToken").value("access-token"))
                    .andExpect(jsonPath("$.data.refreshToken").value("refresh-token"));
        }
        
        @Test
        @DisplayName("Should return conflict when email already exists")
        void shouldReturnConflictWhenEmailExists() throws Exception {
            RegisterRequest request = new RegisterRequest(
                    "existing@example.com",
                    "SecurePassword123!",
                    "John",
                    "Doe"
            );
            
            when(registerUserUseCase.execute(any(RegisterRequest.class)))
                    .thenThrow(new ConflictException("Email already registered"));
            
            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.success").value(false));
        }
        
        @Test
        @DisplayName("Should return bad request with invalid data")
        void shouldReturnBadRequestWithInvalidData() throws Exception {
            RegisterRequest request = new RegisterRequest(
                    "invalid-email",
                    "weak",
                    "",
                    ""
            );
            
            mockMvc.perform(post("/api/v1/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isBadRequest());
        }
    }
    
    @Nested
    @DisplayName("Login")
    class LoginTests {
        
        @Test
        @DisplayName("Should login successfully with valid credentials")
        void shouldLoginSuccessfully() throws Exception {
            LoginRequest request = new LoginRequest("user@example.com", "password123");
            
            ProfileResponse profileResponse = new ProfileResponse(
                    "John",
                    "Doe",
                    null,
                    null,
                    null,
                    null,
                    null
            );
            
            UserResponse userResponse = new UserResponse(
                    UUID.randomUUID(),
                    "user@example.com",
                    "USER",
                    true,
                    profileResponse,
                    Instant.now(),
                    Instant.now()
            );
            
            AuthResponse response = new AuthResponse(
                    "access-token",
                    "refresh-token",
                    userResponse
            );
            
            when(loginUserUseCase.execute(any(LoginRequest.class))).thenReturn(response);
            
            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.accessToken").value("access-token"));
        }
        
        @Test
        @DisplayName("Should return unauthorized with invalid credentials")
        void shouldReturnUnauthorizedWithInvalidCredentials() throws Exception {
            LoginRequest request = new LoginRequest("user@example.com", "wrongpassword");
            
            when(loginUserUseCase.execute(any(LoginRequest.class)))
                    .thenThrow(new UnauthorizedException("Invalid email or password"));
            
            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }
    
    @Nested
    @DisplayName("Token Refresh")
    class TokenRefreshTests {
        
        @Test
        @DisplayName("Should refresh token successfully")
        void shouldRefreshTokenSuccessfully() throws Exception {
            RefreshTokenRequest request = new RefreshTokenRequest("valid-refresh-token");
            
            ProfileResponse profileResponse = new ProfileResponse(
                    "John",
                    "Doe",
                    null,
                    null,
                    null,
                    null,
                    null
            );
            
            UserResponse userResponse = new UserResponse(
                    UUID.randomUUID(),
                    "user@example.com",
                    "USER",
                    true,
                    profileResponse,
                    Instant.now(),
                    Instant.now()
            );
            
            AuthResponse response = new AuthResponse(
                    "new-access-token",
                    "new-refresh-token",
                    userResponse
            );
            
            when(refreshTokenUseCase.execute(any(RefreshTokenRequest.class))).thenReturn(response);
            
            mockMvc.perform(post("/api/v1/auth/refresh-token")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.accessToken").value("new-access-token"));
        }
    }
}
