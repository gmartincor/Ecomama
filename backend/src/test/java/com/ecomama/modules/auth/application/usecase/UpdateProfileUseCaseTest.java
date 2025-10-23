package com.ecomama.modules.auth.application.usecase;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ecomama.modules.auth.domain.Profile;
import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.presentation.dto.UpdateProfileRequest;
import com.ecomama.modules.auth.presentation.dto.UserResponse;
import com.ecomama.modules.auth.presentation.mapper.ProfileMapper;
import com.ecomama.modules.auth.presentation.mapper.UserMapper;
import com.ecomama.shared.exception.NotFoundException;
import com.ecomama.shared.test.fixture.UserFixture;

@ExtendWith(MockitoExtension.class)
@DisplayName("Update Profile Use Case Tests")
class UpdateProfileUseCaseTest {

    private static final UUID USER_ID = UUID.randomUUID();

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProfileMapper profileMapper;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UpdateProfileUseCase updateProfileUseCase;

    @Nested
    @DisplayName("Successful Profile Update")
    class SuccessfulUpdateTests {

        @Test
        @DisplayName("Should update user profile successfully")
        void shouldUpdateProfileSuccessfully() {
            User user = UserFixture.aVerifiedUser().build();
            UpdateProfileRequest request = new UpdateProfileRequest(
                "UpdatedFirst", "UpdatedLast", "1234567890", "New bio", "avatar.png", "City", "Country"
            );
            Profile updatedProfile = mock(Profile.class);
            UserResponse expectedResponse = mock(UserResponse.class);
            
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
            when(profileMapper.toProfile(request)).thenReturn(updatedProfile);
            when(userRepository.save(any(User.class))).thenReturn(user);
            when(userMapper.toUserResponse(user)).thenReturn(expectedResponse);

            UserResponse response = updateProfileUseCase.execute(USER_ID, request);

            assertThat(response).isEqualTo(expectedResponse);
            verify(userRepository).findById(USER_ID);
            verify(profileMapper).toProfile(request);
            verify(userRepository).save(any(User.class));
            verify(userMapper).toUserResponse(user);
        }

        @Test
        @DisplayName("Should map request to profile and save")
        void shouldMapAndSave() {
            User user = UserFixture.aVerifiedUser().build();
            UpdateProfileRequest request = new UpdateProfileRequest(
                "UpdatedFirst", "UpdatedLast", "", "", "", "", ""
            );
            Profile updatedProfile = mock(Profile.class);
            
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
            when(profileMapper.toProfile(request)).thenReturn(updatedProfile);
            when(userRepository.save(any(User.class))).thenReturn(user);

            updateProfileUseCase.execute(USER_ID, request);

            verify(profileMapper).toProfile(request);
            verify(userRepository).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("Profile Update Failures")
    class UpdateFailureTests {

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            UpdateProfileRequest request = new UpdateProfileRequest(
                "First", "Last", "", "", "", "", ""
            );
            
            when(userRepository.findById(USER_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> updateProfileUseCase.execute(USER_ID, request))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("User not found");

            verify(profileMapper, never()).toProfile(any());
            verify(userRepository, never()).save(any());
        }
    }
}
