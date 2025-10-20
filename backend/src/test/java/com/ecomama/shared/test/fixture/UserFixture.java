package com.ecomama.shared.test.fixture;

import com.ecomama.modules.auth.domain.Profile;
import com.ecomama.modules.auth.domain.Role;
import com.ecomama.modules.auth.domain.User;

import java.time.Instant;
import java.util.UUID;

public final class UserFixture {
    
    private UserFixture() {
    }
    
    public static UserBuilder aUser() {
        return new UserBuilder();
    }
    
    public static UserBuilder aVerifiedUser() {
        return new UserBuilder().emailVerified(true);
    }
    
    public static UserBuilder anUnverifiedUser() {
        return new UserBuilder().emailVerified(false);
    }
    
    public static UserBuilder anAdmin() {
        return new UserBuilder().role(Role.ADMIN);
    }
    
    public static class UserBuilder {
        private UUID id;
        private String email = "user@example.com";
        private String passwordHash = "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG";
        private Role role = Role.USER;
        private boolean emailVerified = true;
        private String emailVerificationToken;
        private Instant emailVerificationTokenExpiry;
        private String passwordResetToken;
        private Instant passwordResetTokenExpiry;
        private Profile profile = Profile.builder()
                .firstName("John")
                .lastName("Doe")
                .build();
        private boolean active = true;
        private Instant lastLoginAt;
        
        public UserBuilder id(UUID id) {
            this.id = id;
            return this;
        }
        
        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public UserBuilder passwordHash(String passwordHash) {
            this.passwordHash = passwordHash;
            return this;
        }
        
        public UserBuilder role(Role role) {
            this.role = role;
            return this;
        }
        
        public UserBuilder emailVerified(boolean emailVerified) {
            this.emailVerified = emailVerified;
            return this;
        }
        
        public UserBuilder emailVerificationToken(String token, Instant expiry) {
            this.emailVerificationToken = token;
            this.emailVerificationTokenExpiry = expiry;
            return this;
        }
        
        public UserBuilder passwordResetToken(String token, Instant expiry) {
            this.passwordResetToken = token;
            this.passwordResetTokenExpiry = expiry;
            return this;
        }
        
        public UserBuilder profile(Profile profile) {
            this.profile = profile;
            return this;
        }
        
        public UserBuilder active(boolean active) {
            this.active = active;
            return this;
        }
        
        public UserBuilder lastLoginAt(Instant lastLoginAt) {
            this.lastLoginAt = lastLoginAt;
            return this;
        }
        
        public User build() {
            User user = User.builder()
                    .email(email)
                    .passwordHash(passwordHash)
                    .role(role)
                    .emailVerified(emailVerified)
                    .profile(profile)
                    .active(active)
                    .build();
            
            if (id != null) {
                try {
                    var idField = User.class.getDeclaredField("id");
                    idField.setAccessible(true);
                    idField.set(user, id);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to set user id", e);
                }
            }
            
            if (emailVerificationToken != null) {
                user.setEmailVerificationToken(emailVerificationToken, emailVerificationTokenExpiry);
            }
            
            if (passwordResetToken != null) {
                user.setPasswordResetToken(passwordResetToken, passwordResetTokenExpiry);
            }
            
            if (lastLoginAt != null) {
                try {
                    var field = User.class.getDeclaredField("lastLoginAt");
                    field.setAccessible(true);
                    field.set(user, lastLoginAt);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to set lastLoginAt", e);
                }
            }
            
            return user;
        }
    }
}
