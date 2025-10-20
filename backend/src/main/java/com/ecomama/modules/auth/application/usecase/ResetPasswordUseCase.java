package com.ecomama.modules.auth.application.usecase;

import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.domain.service.PasswordService;
import com.ecomama.modules.auth.presentation.dto.ResetPasswordRequest;
import com.ecomama.shared.exception.NotFoundException;
import com.ecomama.shared.exception.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResetPasswordUseCase {
    
    private final UserRepository userRepository;
    private final PasswordService passwordService;
    
    @Transactional
    public void execute(String email, ResetPasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        if (!user.isPasswordResetTokenValid(request.token())) {
            throw new ValidationException("Invalid or expired reset token");
        }
        
        passwordService.validatePassword(request.newPassword());
        
        String newPasswordHash = passwordService.hashPassword(request.newPassword());
        user.resetPassword(newPasswordHash);
        
        userRepository.save(user);
        
        log.info("Password reset for user: {}", user.getId());
    }
}
