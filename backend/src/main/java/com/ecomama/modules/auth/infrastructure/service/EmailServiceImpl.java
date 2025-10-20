package com.ecomama.modules.auth.infrastructure.service;

import com.ecomama.modules.auth.application.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@ecomama.com}")
    private String fromEmail;

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    @Value("${app.name:Ecomama}")
    private String appName;

    @Async
    @Override
    public void sendVerificationEmail(String toEmail, String firstName, String token) {
        try {
            String subject = "Verify Your Email Address";
            String htmlContent = buildVerificationEmailHtml(firstName, token);
            sendEmail(toEmail, subject, htmlContent);
            log.info("Verification email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", toEmail, e);
        }
    }

    @Async
    @Override
    public void sendPasswordResetEmail(String toEmail, String firstName, String token) {
        try {
            String subject = "Reset Your Password";
            String htmlContent = buildPasswordResetEmailHtml(firstName, token);
            sendEmail(toEmail, subject, htmlContent);
            log.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
        }
    }

    @Async
    @Override
    public void sendWelcomeEmail(String toEmail, String firstName) {
        try {
            String subject = "Welcome to " + appName;
            String htmlContent = buildWelcomeEmailHtml(firstName);
            sendEmail(toEmail, subject, htmlContent);
            log.info("Welcome email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", toEmail, e);
        }
    }

    private void sendEmail(String to, String subject, String htmlContent) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    private String buildVerificationEmailHtml(String firstName, String token) {
        String verificationUrl = appUrl + "/verify-email?token=" + token;
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #4CAF50;">Welcome to %s!</h2>
                    <p>Hi %s,</p>
                    <p>Thank you for registering with %s. Please verify your email address by clicking the button below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">%s</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create an account with %s, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">%s Team</p>
                </div>
            </body>
            </html>
            """, appName, firstName, appName, verificationUrl, verificationUrl, appName, appName);
    }

    private String buildPasswordResetEmailHtml(String firstName, String token) {
        String resetUrl = appUrl + "/reset-password?token=" + token;
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #FF5722;">Password Reset Request</h2>
                    <p>Hi %s,</p>
                    <p>We received a request to reset your password. Click the button below to reset it:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" style="background-color: #FF5722; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">%s</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">%s Team</p>
                </div>
            </body>
            </html>
            """, firstName, resetUrl, resetUrl, appName);
    }

    private String buildWelcomeEmailHtml(String firstName) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #4CAF50;">Welcome to %s!</h2>
                    <p>Hi %s,</p>
                    <p>Your email has been verified successfully! Welcome to our community of organic farmers and conscious consumers.</p>
                    <p>You can now:</p>
                    <ul>
                        <li>Browse and create listings for organic products</li>
                        <li>Discover local events and news</li>
                        <li>Join community discussions</li>
                        <li>Connect with other members</li>
                    </ul>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a>
                    </div>
                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">%s Team</p>
                </div>
            </body>
            </html>
            """, appName, firstName, appUrl, appName);
    }
}
