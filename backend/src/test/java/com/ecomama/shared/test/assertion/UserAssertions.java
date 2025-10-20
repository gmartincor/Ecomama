package com.ecomama.shared.test.assertion;

import com.ecomama.modules.auth.domain.Role;
import com.ecomama.modules.auth.domain.User;
import org.assertj.core.api.AbstractAssert;

import static org.assertj.core.api.Assertions.assertThat;

public class UserAssertions extends AbstractAssert<UserAssertions, User> {
    
    protected UserAssertions(User user) {
        super(user, UserAssertions.class);
    }
    
    public static UserAssertions assertThatUser(User user) {
        return new UserAssertions(user);
    }
    
    public UserAssertions hasEmail(String email) {
        isNotNull();
        assertThat(actual.getEmail())
                .as("User email")
                .isEqualTo(email);
        return this;
    }
    
    public UserAssertions hasRole(Role role) {
        isNotNull();
        assertThat(actual.getRole())
                .as("User role")
                .isEqualTo(role);
        return this;
    }
    
    public UserAssertions isEmailVerified() {
        isNotNull();
        assertThat(actual.isEmailVerified())
                .as("User email verified")
                .isTrue();
        return this;
    }
    
    public UserAssertions isEmailNotVerified() {
        isNotNull();
        assertThat(actual.isEmailVerified())
                .as("User email verified")
                .isFalse();
        return this;
    }
    
    public UserAssertions isActive() {
        isNotNull();
        assertThat(actual.isActive())
                .as("User active")
                .isTrue();
        return this;
    }
    
    public UserAssertions isInactive() {
        isNotNull();
        assertThat(actual.isActive())
                .as("User active")
                .isFalse();
        return this;
    }
    
    public UserAssertions hasProfileWithName(String firstName, String lastName) {
        isNotNull();
        assertThat(actual.getProfile())
                .as("User profile")
                .isNotNull();
        assertThat(actual.getProfile().getFirstName())
                .as("Profile first name")
                .isEqualTo(firstName);
        assertThat(actual.getProfile().getLastName())
                .as("Profile last name")
                .isEqualTo(lastName);
        return this;
    }
    
    public UserAssertions hasLastLoginSet() {
        isNotNull();
        assertThat(actual.getLastLoginAt())
                .as("Last login timestamp")
                .isNotNull();
        return this;
    }
}
