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

import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.presentation.dto.UserResponse;
import com.ecomama.modules.auth.presentation.mapper.UserMapper;
import com.ecomama.shared.exception.NotFoundException;
import com.ecomama.shared.test.fixture.UserFixture;

@ExtendWith(MockitoExtension.class)
@DisplayName("Get Profile Use Case Tests")
class GetProfileUseCaseTest {

    private static final UUID USER_ID = UUID.randomUUID();

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private GetProfileUseCase getProfileUseCase;

    @Nested
    @DisplayName("Successful Profile Retrieval")
    class SuccessfulRetrievalTests {

        @Test
        @DisplayName("Should get user profile successfully")
        void shouldGetProfileSuccessfully() {
            User user = UserFixture.aVerifiedUser().build();
            UserResponse expectedResponse = mock(UserResponse.class);
            
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
            when(userMapper.toUserResponse(user)).thenReturn(expectedResponse);

            UserResponse response = getProfileUseCase.execute(USER_ID);

            assertThat(response).isEqualTo(expectedResponse);
            verify(userRepository).findById(USER_ID);
            verify(userMapper).toUserResponse(user);
        }

        @Test
        @DisplayName("Should map user to response correctly")
        void shouldMapUserToResponse() {
            User user = UserFixture.aVerifiedUser().build();
            
            when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));

            getProfileUseCase.execute(USER_ID);

            verify(userMapper).toUserResponse(user);
        }
    }

    @Nested
    @DisplayName("Profile Retrieval Failures")
    class RetrievalFailureTests {

        @Test
        @DisplayName("Should throw exception when user not found")
        void shouldThrowExceptionWhenUserNotFound() {
            when(userRepository.findById(USER_ID)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> getProfileUseCase.execute(USER_ID))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("User not found");

            verify(userMapper, never()).toUserResponse(any());
        }
    }
}
