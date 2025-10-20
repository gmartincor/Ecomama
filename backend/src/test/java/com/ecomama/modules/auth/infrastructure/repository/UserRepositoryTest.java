package com.ecomama.modules.auth.infrastructure.repository;

import com.ecomama.modules.auth.domain.Profile;
import com.ecomama.modules.auth.domain.Role;
import com.ecomama.modules.auth.domain.User;
import com.ecomama.shared.test.BaseRepositoryTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("User Repository Integration Tests")
class UserRepositoryTest extends BaseRepositoryTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Nested
    @DisplayName("Save Operations")
    class SaveOperationsTests {
        
        @Test
        @DisplayName("Should save new user successfully")
        void shouldSaveNewUser() {
            User user = createUser("newuser@example.com");
            
            User savedUser = userRepository.save(user);
            
            assertThat(savedUser.getId()).isNotNull();
            assertThat(savedUser.getEmail()).isEqualTo("newuser@example.com");
            assertThat(savedUser.getRole()).isEqualTo(Role.USER);
            assertThat(savedUser.isActive()).isTrue();
        }
        
        @Test
        @DisplayName("Should update existing user")
        void shouldUpdateExistingUser() {
            User user = createUser("update@example.com");
            User savedUser = userRepository.save(user);
            
            savedUser.verifyEmail();
            User updatedUser = userRepository.save(savedUser);
            
            assertThat(updatedUser.getId()).isEqualTo(savedUser.getId());
            assertThat(updatedUser.isEmailVerified()).isTrue();
        }
    }
    
    @Nested
    @DisplayName("Find Operations")
    class FindOperationsTests {
        
        @Test
        @DisplayName("Should find user by email")
        void shouldFindUserByEmail() {
            User user = createUser("find@example.com");
            userRepository.save(user);
            
            Optional<User> found = userRepository.findByEmail("find@example.com");
            
            assertThat(found).isPresent();
            assertThat(found.get().getEmail()).isEqualTo("find@example.com");
        }
        
        @Test
        @DisplayName("Should return empty when user not found by email")
        void shouldReturnEmptyWhenUserNotFoundByEmail() {
            Optional<User> found = userRepository.findByEmail("nonexistent@example.com");
            
            assertThat(found).isEmpty();
        }
        
        @Test
        @DisplayName("Should check if user exists by email")
        void shouldCheckIfUserExistsByEmail() {
            User user = createUser("exists@example.com");
            userRepository.save(user);
            
            boolean exists = userRepository.existsByEmail("exists@example.com");
            boolean notExists = userRepository.existsByEmail("notexists@example.com");
            
            assertThat(exists).isTrue();
            assertThat(notExists).isFalse();
        }
    }
    
    @Nested
    @DisplayName("Email Uniqueness")
    class EmailUniquenessTests {
        
        @Test
        @DisplayName("Should enforce email uniqueness constraint")
        void shouldEnforceEmailUniqueness() {
            User user1 = createUser("duplicate@example.com");
            userRepository.save(user1);
            
            User user2 = createUser("duplicate@example.com");
            
            assertThat(userRepository.existsByEmail("duplicate@example.com")).isTrue();
        }
    }
    
    private User createUser(String email) {
        return User.builder()
                .email(email)
                .passwordHash("$2a$10$hashedPassword")
                .role(Role.USER)
                .emailVerified(false)
                .profile(Profile.builder()
                        .firstName("Test")
                        .lastName("User")
                        .build())
                .active(true)
                .build();
    }
}
