package com.ecomama.modules.auth.application.service;

public interface EmailService {

    void sendVerificationEmail(String toEmail, String firstName, String token);

    void sendPasswordResetEmail(String toEmail, String firstName, String token);

    void sendWelcomeEmail(String toEmail, String firstName);
}
