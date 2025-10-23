package com.ecomama.modules.auth.presentation.controller;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.ecomama.modules.auth.application.usecase.GetProfileUseCase;
import com.ecomama.modules.auth.application.usecase.UpdateProfileUseCase;
import com.ecomama.modules.auth.infrastructure.security.CustomUserDetails;
import com.ecomama.modules.auth.presentation.dto.ProfileResponse;
import com.ecomama.modules.auth.presentation.dto.UpdateProfileRequest;
import com.ecomama.modules.auth.presentation.dto.UserResponse;
import com.ecomama.shared.exception.NotFoundException;
import com.ecomama.shared.test.BaseWebMvcTest;

@DisplayName("User Controller Integration Tests")
class UserControllerTest extends BaseWebMvcTest {

    @MockitoBean
    private GetProfileUseCase getProfileUseCase;

    @MockitoBean
    private UpdateProfileUseCase updateProfileUseCase;

    private CustomUserDetails createCustomUserDetails(UUID userId) {
        return new CustomUserDetails(
                userId,
                "user@example.com",
                "password",
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    @Nested
    @DisplayName("Get Profile")
    class GetProfileTests {

        @Test
        @DisplayName("Should get current user profile successfully")
        void shouldGetProfileSuccessfully() throws Exception {
            UUID userId = UUID.randomUUID();
            CustomUserDetails userDetails = createCustomUserDetails(userId);
            
            ProfileResponse profileResponse = new ProfileResponse(
                    "John", "Doe", "1234567890", "Bio", "avatar.png", "City", "Country"
            );
            
            UserResponse userResponse = new UserResponse(
                    userId,
                    "user@example.com",
                    "USER",
                    true,
                    profileResponse,
                    Instant.now(),
                    Instant.now()
            );
            
            when(getProfileUseCase.execute(userId)).thenReturn(userResponse);

            mockMvc.perform(get("/api/v1/users/me")
                            .with(user(userDetails)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.email").value("user@example.com"))
                    .andExpect(jsonPath("$.data.profile.firstName").value("John"));
        }

        @Test
        @DisplayName("Should return forbidden without authentication")
        void shouldReturnForbiddenWithoutAuth() throws Exception {
            mockMvc.perform(get("/api/v1/users/me"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Should return not found when user does not exist")
        void shouldReturnNotFoundWhenUserDoesNotExist() throws Exception {
            UUID userId = UUID.randomUUID();
            CustomUserDetails userDetails = createCustomUserDetails(userId);
            
            when(getProfileUseCase.execute(userId))
                    .thenThrow(new NotFoundException("User not found"));

            mockMvc.perform(get("/api/v1/users/me")
                            .with(user(userDetails)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }

    @Nested
    @DisplayName("Update Profile")
    class UpdateProfileTests {

        @Test
        @DisplayName("Should update user profile successfully")
        void shouldUpdateProfileSuccessfully() throws Exception {
            UUID userId = UUID.randomUUID();
            CustomUserDetails userDetails = createCustomUserDetails(userId);
            
            UpdateProfileRequest request = new UpdateProfileRequest(
                    "UpdatedFirst",
                    "UpdatedLast",
                    "9876543210",
                    "Updated bio",
                    "new-avatar.png",
                    "NewCity",
                    "NewCountry"
            );
            
            ProfileResponse profileResponse = new ProfileResponse(
                    "UpdatedFirst", "UpdatedLast", "9876543210", "Updated bio", 
                    "new-avatar.png", "NewCity", "NewCountry"
            );
            
            UserResponse userResponse = new UserResponse(
                    userId,
                    "user@example.com",
                    "USER",
                    true,
                    profileResponse,
                    Instant.now(),
                    Instant.now()
            );
            
            when(updateProfileUseCase.execute(eq(userId), any(UpdateProfileRequest.class)))
                    .thenReturn(userResponse);

            mockMvc.perform(put("/api/v1/users/profile")
                            .with(user(userDetails))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.profile.firstName").value("UpdatedFirst"))
                    .andExpect(jsonPath("$.data.profile.lastName").value("UpdatedLast"));
        }

        @Test
        @DisplayName("Should return forbidden without authentication")
        void shouldReturnForbiddenWithoutAuth() throws Exception {
            UpdateProfileRequest request = new UpdateProfileRequest(
                    "First", "Last", "", "", "", "", ""
            );

            mockMvc.perform(put("/api/v1/users/profile")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Should return bad request with invalid data")
        void shouldReturnBadRequestWithInvalidData() throws Exception {
            UUID userId = UUID.randomUUID();
            CustomUserDetails userDetails = createCustomUserDetails(userId);
            
            UpdateProfileRequest request = new UpdateProfileRequest(
                    "a".repeat(101),
                    "b".repeat(101),
                    "",
                    "",
                    "",
                    "",
                    ""
            );

            mockMvc.perform(put("/api/v1/users/profile")
                            .with(user(userDetails))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Should return not found when user does not exist")
        void shouldReturnNotFoundWhenUserDoesNotExist() throws Exception {
            UUID userId = UUID.randomUUID();
            CustomUserDetails userDetails = createCustomUserDetails(userId);
            
            UpdateProfileRequest request = new UpdateProfileRequest(
                    "First", "Last", "", "", "", "", ""
            );
            
            when(updateProfileUseCase.execute(eq(userId), any(UpdateProfileRequest.class)))
                    .thenThrow(new NotFoundException("User not found"));

            mockMvc.perform(put("/api/v1/users/profile")
                            .with(user(userDetails))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(request)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }
}
