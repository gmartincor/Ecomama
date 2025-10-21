package com.ecomama.modules.auth.domain;

import com.ecomama.shared.domain.AggregateRoot;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_users_email", columnList = "email", unique = true)
})
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends AggregateRoot<UUID> {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Role role = Role.USER;

    @Builder.Default
    @Column(nullable = false)
    private boolean emailVerified = false;

    @Column(length = 100)
    private String emailVerificationToken;

    private Instant emailVerificationTokenExpiry;

    @Column(length = 100)
    private String passwordResetToken;

    private Instant passwordResetTokenExpiry;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "firstName", column = @Column(name = "first_name", length = 100)),
            @AttributeOverride(name = "lastName", column = @Column(name = "last_name", length = 100)),
            @AttributeOverride(name = "phoneNumber", column = @Column(name = "phone_number", length = 20)),
            @AttributeOverride(name = "bio", column = @Column(name = "bio", columnDefinition = "TEXT")),
            @AttributeOverride(name = "avatarUrl", column = @Column(name = "avatar_url", length = 500)),
            @AttributeOverride(name = "city", column = @Column(name = "city", length = 100)),
            @AttributeOverride(name = "country", column = @Column(name = "country", length = 100)),
            @AttributeOverride(name = "preferredLocale", column = @Column(name = "preferred_locale", length = 5))
    })
    private Profile profile;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    private Instant lastLoginAt;

    public void verifyEmail() {
        this.emailVerified = true;
        this.emailVerificationToken = null;
        this.emailVerificationTokenExpiry = null;
    }

    public void setEmailVerificationToken(String token, Instant expiry) {
        this.emailVerificationToken = token;
        this.emailVerificationTokenExpiry = expiry;
    }

    public boolean isEmailVerificationTokenValid(String token) {
        return this.emailVerificationToken != null
                && this.emailVerificationToken.equals(token)
                && this.emailVerificationTokenExpiry != null
                && this.emailVerificationTokenExpiry.isAfter(Instant.now());
    }

    public void setPasswordResetToken(String token, Instant expiry) {
        this.passwordResetToken = token;
        this.passwordResetTokenExpiry = expiry;
    }

    public boolean isPasswordResetTokenValid(String token) {
        return this.passwordResetToken != null
                && this.passwordResetToken.equals(token)
                && this.passwordResetTokenExpiry != null
                && this.passwordResetTokenExpiry.isAfter(Instant.now());
    }

    public void resetPassword(String newPasswordHash) {
        this.passwordHash = newPasswordHash;
        this.passwordResetToken = null;
        this.passwordResetTokenExpiry = null;
    }

    public void updateProfile(Profile newProfile) {
        this.profile = newProfile;
    }

    public void updatePassword(String newPasswordHash) {
        this.passwordHash = newPasswordHash;
    }

    public void recordLogin() {
        this.lastLoginAt = Instant.now();
    }

    public void deactivate() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }
}
