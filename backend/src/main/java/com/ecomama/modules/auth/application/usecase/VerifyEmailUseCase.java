package com.ecomama.modules.auth.application.usecase;

import com.ecomama.modules.auth.application.service.EmailService;
import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.presentation.dto.VerifyEmailRequest;
import com.ecomama.shared.exception.NotFoundException;
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
    public void execute(String email, VerifyEmailRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        if (user.isEmailVerified()) {
            throw new ValidationException("Email already verified");
        }
        
        if (!user.isEmailVerificationTokenValid(request.token())) {
            throw new ValidationException("Invalid or expired verification token");
        }
        
        user.verifyEmail();
        userRepository.save(user);
        
        emailService.sendWelcomeEmail(user.getEmail(), user.getProfile().getFirstName());
        
        log.info("Email verified for user: {}", user.getId());
    }
}
