package com.ecomama.modules.auth.application.usecase;

import com.ecomama.modules.auth.application.service.EmailService;
import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.shared.exception.NotFoundException;
import com.ecomama.shared.exception.ValidationException;
import com.ecomama.shared.util.TokenGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResendVerificationEmailUseCase {
    
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    @Transactional
    public void execute(UUID userId) {
        log.info("Resending verification email for user: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        if (user.isEmailVerified()) {
            throw new ValidationException("Email is already verified");
        }
        
        if (!user.isActive()) {
            throw new ValidationException("Account is deactivated");
        }
        
        String verificationToken = TokenGenerator.generateSecureToken();
        Instant tokenExpiry = Instant.now().plus(24, ChronoUnit.HOURS);
        
        user.setEmailVerificationToken(verificationToken, tokenExpiry);
        userRepository.save(user);
        
        emailService.sendVerificationEmail(
                user.getEmail(),
                user.getProfile().getFirstName(),
                verificationToken,
                user.getProfile().getPreferredLocale()
        );
        
        log.info("Verification email resent successfully for user: {}", userId);
    }
}
