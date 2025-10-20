package com.ecomama.modules.auth.domain.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import com.ecomama.shared.exception.ValidationException;

@DisplayName("Password Service Tests")
class PasswordServiceTest {
    
    private PasswordService passwordService;
    
    @BeforeEach
    void setUp() {
        passwordService = new PasswordService();
    }
    
    @Nested
    @DisplayName("Password Validation")
    class PasswordValidationTests {
        
        @Test
        @DisplayName("Should accept valid strong password")
        void shouldAcceptValidStrongPassword() {
            assertThatCode(() -> passwordService.validatePassword("SecurePassword123!"))
                    .doesNotThrowAnyException();
        }
        
        @ParameterizedTest
        @ValueSource(strings = {"short", "pass", "1234567"})
        @DisplayName("Should reject password shorter than 8 characters")
        void shouldRejectShortPassword(String password) {
            assertThatThrownBy(() -> passwordService.validatePassword(password))
                    .isInstanceOf(ValidationException.class)
                    .hasMessageContaining("at least 8 characters");
        }
        
        @Test
        @DisplayName("Should reject password longer than 72 characters")
        void shouldRejectLongPassword() {
            String longPassword = "a".repeat(73);
            
            assertThatThrownBy(() -> passwordService.validatePassword(longPassword))
                    .isInstanceOf(ValidationException.class)
                    .hasMessageContaining("maximum 72 characters");
        }
        
        @Test
        @DisplayName("Should reject null password")
        void shouldRejectNullPassword() {
            assertThatThrownBy(() -> passwordService.validatePassword(null))
                    .isInstanceOf(ValidationException.class);
        }
        
        @Test
        @DisplayName("Should reject empty password")
        void shouldRejectEmptyPassword() {
            assertThatThrownBy(() -> passwordService.validatePassword(""))
                    .isInstanceOf(ValidationException.class);
        }
    }
    
    @Nested
    @DisplayName("Password Hashing")
    class PasswordHashingTests {
        
        @Test
        @DisplayName("Should hash password successfully")
        void shouldHashPasswordSuccessfully() {
            String password = "SecurePassword123!";
            
            String hash = passwordService.hashPassword(password);
            
            assertThat(hash)
                    .isNotNull()
                    .isNotEmpty()
                    .startsWith("$2a$")
                    .hasSizeGreaterThan(50);
        }
        
        @Test
        @DisplayName("Should generate different hashes for same password")
        void shouldGenerateDifferentHashesForSamePassword() {
            String password = "SecurePassword123!";
            
            String hash1 = passwordService.hashPassword(password);
            String hash2 = passwordService.hashPassword(password);
            
            assertThat(hash1).isNotEqualTo(hash2);
        }
        
        @Test
        @DisplayName("Should throw exception when hashing null password")
        void shouldThrowExceptionWhenHashingNullPassword() {
            assertThatThrownBy(() -> passwordService.hashPassword(null))
                    .isInstanceOf(IllegalArgumentException.class);
        }
    }
    
    @Nested
    @DisplayName("Password Matching")
    class PasswordMatchingTests {
        
        @Test
        @DisplayName("Should match correct password with hash")
        void shouldMatchCorrectPasswordWithHash() {
            String password = "SecurePassword123!";
            String hash = passwordService.hashPassword(password);
            
            boolean matches = passwordService.matches(password, hash);
            
            assertThat(matches).isTrue();
        }
        
        @Test
        @DisplayName("Should not match incorrect password with hash")
        void shouldNotMatchIncorrectPasswordWithHash() {
            String password = "SecurePassword123!";
            String hash = passwordService.hashPassword(password);
            
            boolean matches = passwordService.matches("WrongPassword123!", hash);
            
            assertThat(matches).isFalse();
        }
        
        @Test
        @DisplayName("Should not match null password")
        void shouldNotMatchNullPassword() {
            String hash = passwordService.hashPassword("SecurePassword123!");
            
            boolean matches = passwordService.matches(null, hash);
            
            assertThat(matches).isFalse();
        }
        
        @Test
        @DisplayName("Should not match with null hash")
        void shouldNotMatchWithNullHash() {
            boolean matches = passwordService.matches("SecurePassword123!", null);
            
            assertThat(matches).isFalse();
        }
    }
}
