package com.ecomama.modules.auth.domain;

import com.ecomama.shared.exception.ValidationException;
import com.ecomama.shared.test.fixture.UserFixture;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.*;

@DisplayName("User Domain Entity Tests")
class UserTest {
    
    private static final String VALID_TOKEN = "verification-token-123";
    private static final long TOKEN_VALIDITY_HOURS = 24;
    
    @Nested
    @DisplayName("Email Verification")
    class EmailVerificationTests {
        
        @Test
        @DisplayName("Should verify email successfully when not already verified")
        void shouldVerifyEmailWhenNotVerified() {
            User user = UserFixture.anUnverifiedUser().build();
            
            user.verifyEmail();
            
            assertThat(user.isEmailVerified()).isTrue();
            assertThat(user.getEmailVerificationToken()).isNull();
            assertThat(user.getEmailVerificationTokenExpiry()).isNull();
        }
        
        @Test
        @DisplayName("Should throw exception when email is already verified")
        void shouldThrowExceptionWhenAlreadyVerified() {
            User user = UserFixture.aVerifiedUser().build();
            
            assertThatThrownBy(user::verifyEmail)
                    .isInstanceOf(ValidationException.class)
                    .hasMessage("Email is already verified");
        }
        
        @Test
        @DisplayName("Should set email verification token with expiry")
        void shouldSetEmailVerificationToken() {
            User user = UserFixture.anUnverifiedUser().build();
            Instant expiry = Instant.now().plus(TOKEN_VALIDITY_HOURS, ChronoUnit.HOURS);
            
            user.setEmailVerificationToken(VALID_TOKEN, expiry);
            
            assertThat(user.getEmailVerificationToken()).isEqualTo(VALID_TOKEN);
            assertThat(user.getEmailVerificationTokenExpiry()).isEqualTo(expiry);
        }
        
        @Test
        @DisplayName("Should validate email verification token successfully")
        void shouldValidateEmailVerificationToken() {
            User user = UserFixture.anUnverifiedUser().build();
            Instant expiry = Instant.now().plus(TOKEN_VALIDITY_HOURS, ChronoUnit.HOURS);
            user.setEmailVerificationToken(VALID_TOKEN, expiry);
            
            boolean isValid = user.isEmailVerificationTokenValid(VALID_TOKEN);
            
            assertThat(isValid).isTrue();
        }
        
        @Test
        @DisplayName("Should reject expired email verification token")
        void shouldRejectExpiredEmailVerificationToken() {
            User user = UserFixture.anUnverifiedUser().build();
            Instant expiry = Instant.now().minus(1, ChronoUnit.HOURS);
            user.setEmailVerificationToken(VALID_TOKEN, expiry);
            
            boolean isValid = user.isEmailVerificationTokenValid(VALID_TOKEN);
            
            assertThat(isValid).isFalse();
        }
        
        @Test
        @DisplayName("Should reject incorrect email verification token")
        void shouldRejectIncorrectEmailVerificationToken() {
            User user = UserFixture.anUnverifiedUser().build();
            Instant expiry = Instant.now().plus(TOKEN_VALIDITY_HOURS, ChronoUnit.HOURS);
            user.setEmailVerificationToken(VALID_TOKEN, expiry);
            
            boolean isValid = user.isEmailVerificationTokenValid("wrong-token");
            
            assertThat(isValid).isFalse();
        }
    }
    
    @Nested
    @DisplayName("Password Reset")
    class PasswordResetTests {
        
        @Test
        @DisplayName("Should set password reset token with expiry")
        void shouldSetPasswordResetToken() {
            User user = UserFixture.aVerifiedUser().build();
            String resetToken = "reset-token-123";
            Instant expiry = Instant.now().plus(1, ChronoUnit.HOURS);
            
            user.setPasswordResetToken(resetToken, expiry);
            
            assertThat(user.getPasswordResetToken()).isEqualTo(resetToken);
            assertThat(user.getPasswordResetTokenExpiry()).isEqualTo(expiry);
        }
        
        @Test
        @DisplayName("Should validate password reset token successfully")
        void shouldValidatePasswordResetToken() {
            User user = UserFixture.aVerifiedUser().build();
            String resetToken = "reset-token-123";
            Instant expiry = Instant.now().plus(1, ChronoUnit.HOURS);
            user.setPasswordResetToken(resetToken, expiry);
            
            boolean isValid = user.isPasswordResetTokenValid(resetToken);
            
            assertThat(isValid).isTrue();
        }
        
        @Test
        @DisplayName("Should reject expired password reset token")
        void shouldRejectExpiredPasswordResetToken() {
            User user = UserFixture.aVerifiedUser().build();
            String resetToken = "reset-token-123";
            Instant expiry = Instant.now().minus(1, ChronoUnit.HOURS);
            user.setPasswordResetToken(resetToken, expiry);
            
            boolean isValid = user.isPasswordResetTokenValid(resetToken);
            
            assertThat(isValid).isFalse();
        }
        
        @Test
        @DisplayName("Should reset password and clear token")
        void shouldResetPasswordAndClearToken() {
            User user = UserFixture.aVerifiedUser().build();
            String resetToken = "reset-token-123";
            Instant expiry = Instant.now().plus(1, ChronoUnit.HOURS);
            user.setPasswordResetToken(resetToken, expiry);
            String newPasswordHash = "$2a$10$newHashedPassword";
            
            user.resetPassword(newPasswordHash);
            
            assertThat(user.getPasswordHash()).isEqualTo(newPasswordHash);
            assertThat(user.getPasswordResetToken()).isNull();
            assertThat(user.getPasswordResetTokenExpiry()).isNull();
        }
    }
    
    @Nested
    @DisplayName("Profile Management")
    class ProfileManagementTests {
        
        @Test
        @DisplayName("Should update profile successfully")
        void shouldUpdateProfile() {
            User user = UserFixture.aVerifiedUser().build();
            Profile newProfile = Profile.builder()
                    .firstName("Jane")
                    .lastName("Smith")
                    .phoneNumber("+1234567890")
                    .bio("New bio")
                    .city("New York")
                    .country("USA")
                    .build();
            
            user.updateProfile(newProfile);
            
            assertThat(user.getProfile()).isEqualTo(newProfile);
            assertThat(user.getProfile().getFirstName()).isEqualTo("Jane");
            assertThat(user.getProfile().getLastName()).isEqualTo("Smith");
        }
        
        @Test
        @DisplayName("Should update password successfully")
        void shouldUpdatePassword() {
            User user = UserFixture.aVerifiedUser().build();
            String newPasswordHash = "$2a$10$newHashedPassword";
            
            user.updatePassword(newPasswordHash);
            
            assertThat(user.getPasswordHash()).isEqualTo(newPasswordHash);
        }
    }
    
    @Nested
    @DisplayName("User Activation")
    class UserActivationTests {
        
        @Test
        @DisplayName("Should deactivate user")
        void shouldDeactivateUser() {
            User user = UserFixture.aVerifiedUser().build();
            assertThat(user.isActive()).isTrue();
            
            user.deactivate();
            
            assertThat(user.isActive()).isFalse();
        }
        
        @Test
        @DisplayName("Should activate user")
        void shouldActivateUser() {
            User user = UserFixture.aVerifiedUser().active(false).build();
            assertThat(user.isActive()).isFalse();
            
            user.activate();
            
            assertThat(user.isActive()).isTrue();
        }
    }
    
    @Nested
    @DisplayName("Login Tracking")
    class LoginTrackingTests {
        
        @Test
        @DisplayName("Should record login timestamp")
        void shouldRecordLoginTimestamp() {
            User user = UserFixture.aVerifiedUser().build();
            Instant beforeLogin = Instant.now();
            
            user.recordLogin();
            
            assertThat(user.getLastLoginAt())
                    .isNotNull()
                    .isAfterOrEqualTo(beforeLogin)
                    .isBeforeOrEqualTo(Instant.now());
        }
    }
}
