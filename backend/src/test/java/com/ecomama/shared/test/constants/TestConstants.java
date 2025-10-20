package com.ecomama.shared.test.constants;

public final class TestConstants {
    
    private TestConstants() {
    }
    
    public static final class Auth {
        public static final String VALID_EMAIL = "user@example.com";
        public static final String VALID_PASSWORD = "SecurePassword123!";
        public static final String HASHED_PASSWORD = "$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG";
        public static final String ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
        public static final String REFRESH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
        
        private Auth() {
        }
    }
    
    public static final class User {
        public static final String FIRST_NAME = "John";
        public static final String LAST_NAME = "Doe";
        public static final String PHONE_NUMBER = "+1234567890";
        public static final String BIO = "Software Developer";
        public static final String AVATAR_URL = "https://example.com/avatar.jpg";
        public static final String CITY = "New York";
        public static final String COUNTRY = "USA";
        
        private User() {
        }
    }
    
    public static final class Token {
        public static final String VERIFICATION_TOKEN = "verification-token-123";
        public static final String RESET_TOKEN = "reset-token-456";
        public static final long TOKEN_VALIDITY_HOURS = 24;
        public static final long RESET_TOKEN_VALIDITY_HOURS = 1;
        
        private Token() {
        }
    }
}
