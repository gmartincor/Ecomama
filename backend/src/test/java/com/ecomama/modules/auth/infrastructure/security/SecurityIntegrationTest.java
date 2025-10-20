package com.ecomama.modules.auth.infrastructure.security;

import com.ecomama.modules.auth.domain.Profile;
import com.ecomama.modules.auth.domain.Role;
import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.infrastructure.repository.UserRepository;
import com.ecomama.shared.test.BaseIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DisplayName("Security Integration Tests")
class SecurityIntegrationTest extends BaseIntegrationTest {
    
    @Autowired
    private WebApplicationContext context;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    private MockMvc mockMvc;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
        
        userRepository.deleteAll();
    }
    
    @Nested
    @DisplayName("JWT Token Generation")
    class JwtTokenGenerationTests {
        
        @Test
        @DisplayName("Should generate valid access token")
        void shouldGenerateValidAccessToken() {
            User user = createAndSaveUser("token@example.com");
            
            String token = jwtTokenProvider.generateAccessToken(
                    user.getId(),
                    user.getEmail(),
                    user.getRole().name()
            );
            
            boolean isValid = jwtTokenProvider.isTokenValid(token);
            
            assert isValid;
            assert jwtTokenProvider.getUserIdFromToken(token).equals(user.getId());
        }
        
        @Test
        @DisplayName("Should generate valid refresh token")
        void shouldGenerateValidRefreshToken() {
            User user = createAndSaveUser("refresh@example.com");
            
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());
            
            boolean isValid = jwtTokenProvider.isTokenValid(refreshToken);
            
            assert isValid;
        }
    }
    
    @Nested
    @DisplayName("Endpoint Protection")
    class EndpointProtectionTests {
        
        @Test
        @DisplayName("Should allow access to public health endpoint without authentication")
        void shouldAllowPublicEndpoints() throws Exception {
            mockMvc.perform(get("/api/v1/health"))
                    .andExpect(status().isOk());
        }
        
        @Test
        @DisplayName("Should block access to protected endpoints without token")
        void shouldBlockProtectedEndpoints() throws Exception {
            mockMvc.perform(get("/api/v1/users/me"))
                    .andExpect(status().is4xxClientError());
        }
        
        @Test
        @DisplayName("Should allow access to protected endpoints with valid JWT token")
        void shouldAllowProtectedEndpointsWithAuth() throws Exception {
            User user = createAndSaveUser("user@example.com");
            
            String token = jwtTokenProvider.generateAccessToken(
                    user.getId(),
                    user.getEmail(),
                    user.getRole().name()
            );
            
            mockMvc.perform(get("/api/v1/users/me")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk());
        }
    }
    
    @Nested
    @DisplayName("Role-Based Access Control")
    class RoleBasedAccessTests {
        
        @Test
        @DisplayName("Should authenticate admin user with valid token")
        void shouldAuthenticateAdminUser() throws Exception {
            User admin = createAndSaveUser("admin@example.com", Role.ADMIN);
            
            String token = jwtTokenProvider.generateAccessToken(
                    admin.getId(),
                    admin.getEmail(),
                    admin.getRole().name()
            );
            
            assert jwtTokenProvider.isTokenValid(token);
            assert jwtTokenProvider.getUserIdFromToken(token).equals(admin.getId());
            assert jwtTokenProvider.getRoleFromToken(token).equals("ADMIN");
        }
        
        @Test
        @DisplayName("Should deny regular user access to admin endpoints")
        void shouldDenyUserAccessToAdmin() throws Exception {
            User user = createAndSaveUser("user@example.com");
            
            String token = jwtTokenProvider.generateAccessToken(
                    user.getId(),
                    user.getEmail(),
                    user.getRole().name()
            );
            
            mockMvc.perform(get("/api/v1/admin/users")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isForbidden());
        }
    }
    
    private User createAndSaveUser(String email) {
        return createAndSaveUser(email, Role.USER);
    }
    
    private User createAndSaveUser(String email, Role role) {
        User user = User.builder()
                .email(email)
                .passwordHash("$2a$10$hashedPassword")
                .role(role)
                .emailVerified(true)
                .profile(Profile.builder()
                        .firstName("Test")
                        .lastName("User")
                        .build())
                .active(true)
                .build();
        
        return userRepository.save(user);
    }
}
