package com.ecomama.modules.auth;

import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.infrastructure.repository.UserRepository;
import com.ecomama.modules.auth.presentation.dto.LoginRequest;
import com.ecomama.modules.auth.presentation.dto.RegisterRequest;
import com.ecomama.shared.test.BaseIntegrationTest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("Auth E2E Integration Tests")
class AuthE2ETest extends BaseIntegrationTest {
    
    @Autowired
    private WebApplicationContext context;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private MockMvc mockMvc;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
        
        userRepository.deleteAll();
    }
    
    @Test
    @DisplayName("Should complete full registration and login flow")
    void shouldCompleteFullRegistrationAndLoginFlow() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "e2e@example.com",
                "SecurePassword123!",
                "E2E",
                "Test"
        );
        
        String registerResponse = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.user.email").value("e2e@example.com"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        
        User savedUser = userRepository.findByEmail("e2e@example.com").orElseThrow();
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getEmail()).isEqualTo("e2e@example.com");
        
        savedUser.verifyEmail();
        userRepository.save(savedUser);
        
        LoginRequest loginRequest = new LoginRequest("e2e@example.com", "SecurePassword123!");
        
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.user.emailVerified").value(true));
    }
    
    @Test
    @DisplayName("Should prevent duplicate email registration")
    void shouldPreventDuplicateEmailRegistration() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "duplicate@example.com",
                "SecurePassword123!",
                "Test",
                "User"
        );
        
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
        
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }
    
    @Test
    @DisplayName("Should reject login with unverified email")
    void shouldRejectLoginWithUnverifiedEmail() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "unverified@example.com",
                "SecurePassword123!",
                "Test",
                "User"
        );
        
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());
        
        LoginRequest loginRequest = new LoginRequest("unverified@example.com", "SecurePassword123!");
        
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }
}
