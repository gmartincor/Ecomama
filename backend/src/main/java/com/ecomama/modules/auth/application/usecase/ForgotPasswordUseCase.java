package com.ecomama.modules.auth.application.usecase;

import com.ecomama.modules.auth.application.service.EmailService;
import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.presentation.dto.ForgotPasswordRequest;
import com.ecomama.shared.exception.NotFoundException;
import com.ecomama.shared.util.TokenGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForgotPasswordUseCase {
    
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    @Transactional
    public void execute(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        String resetToken = TokenGenerator.generateSecureToken();
        Instant tokenExpiry = Instant.now().plus(1, ChronoUnit.HOURS);
        
        user.setPasswordResetToken(resetToken, tokenExpiry);
        userRepository.save(user);
        
        emailService.sendPasswordResetEmail(
                user.getEmail(), 
                user.getProfile().getFirstName(), 
                resetToken,
                user.getProfile().getPreferredLocale()
        );
        
        log.info("Password reset requested for user: {}", user.getId());
    }
}
