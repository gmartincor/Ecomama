package com.ecomama.modules.auth.application.usecase;

import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.domain.service.PasswordService;
import com.ecomama.modules.auth.presentation.dto.ChangePasswordRequest;
import com.ecomama.shared.exception.NotFoundException;
import com.ecomama.shared.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChangePasswordUseCase {
    
    private final UserRepository userRepository;
    private final PasswordService passwordService;
    
    @Transactional
    public void execute(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        if (!passwordService.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        
        passwordService.validatePassword(request.newPassword());
        
        String newPasswordHash = passwordService.hashPassword(request.newPassword());
        user.updatePassword(newPasswordHash);
        
        userRepository.save(user);
        
        log.info("Password changed for user: {}", userId);
    }
}
