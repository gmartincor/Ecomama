package com.ecomama.modules.auth.application.service;

public interface EmailService {

    void sendVerificationEmail(String toEmail, String firstName, String token, String locale);

    void sendPasswordResetEmail(String toEmail, String firstName, String token, String locale);

    void sendWelcomeEmail(String toEmail, String firstName, String locale);
}
