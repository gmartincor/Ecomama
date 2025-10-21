package com.ecomama.shared.test.fixture;

import com.ecomama.modules.auth.presentation.dto.LoginRequest;
import com.ecomama.modules.auth.presentation.dto.RegisterRequest;

public final class AuthFixture {
    
    private AuthFixture() {
    }
    
    public static RegisterRequestBuilder aRegisterRequest() {
        return new RegisterRequestBuilder();
    }
    
    public static LoginRequestBuilder aLoginRequest() {
        return new LoginRequestBuilder();
    }
    
    public static class RegisterRequestBuilder {
        private String email = "newuser@example.com";
        private String password = "SecurePassword123!";
        private String firstName = "John";
        private String lastName = "Doe";
        private String preferredLocale = "en";
        
        public RegisterRequestBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public RegisterRequestBuilder password(String password) {
            this.password = password;
            return this;
        }
        
        public RegisterRequestBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }
        
        public RegisterRequestBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }
        
        public RegisterRequestBuilder preferredLocale(String preferredLocale) {
            this.preferredLocale = preferredLocale;
            return this;
        }
        
        public RegisterRequest build() {
            return new RegisterRequest(email, password, firstName, lastName, preferredLocale);
        }
    }
    
    public static class LoginRequestBuilder {
        private String email = "user@example.com";
        private String password = "password123";
        
        public LoginRequestBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public LoginRequestBuilder password(String password) {
            this.password = password;
            return this;
        }
        
        public LoginRequest build() {
            return new LoginRequest(email, password);
        }
    }
}
