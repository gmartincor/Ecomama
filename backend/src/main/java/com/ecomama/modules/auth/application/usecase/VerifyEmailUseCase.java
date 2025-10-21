package com.ecomama.modules.auth.application.usecase;

import com.ecomama.modules.auth.application.service.EmailService;
import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.presentation.dto.VerifyEmailRequest;
import com.ecomama.shared.exception.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class VerifyEmailUseCase {
    
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    @Transactional
    public void execute(VerifyEmailRequest request) {
        log.debug("Attempting to verify email with token: {}", request.token());
        
        User user = userRepository.findByEmailVerificationToken(request.token())
                .orElseThrow(() -> {
                    log.warn("No user found with verification token: {}", request.token());
                    return new ValidationException("Invalid or expired verification token");
                });
        
        log.debug("Found user with email: {} for token", user.getEmail());
        
        if (user.isEmailVerified()) {
            log.info("Email already verified for user: {}", user.getId());
            throw new ValidationException("Email is already verified");
        }
        
        if (!user.isEmailVerificationTokenValid(request.token())) {
            log.warn("Token validation failed for user: {}. Token expired at: {}", 
                    user.getId(), user.getEmailVerificationTokenExpiry());
            throw new ValidationException("Verification token has expired");
        }
        
        user.verifyEmail();
        userRepository.save(user);
        
        emailService.sendWelcomeEmail(
                user.getEmail(), 
                user.getProfile().getFirstName(),
                user.getProfile().getPreferredLocale()
        );
        
        log.info("Email verified successfully for user: {}", user.getId());
    }
}
