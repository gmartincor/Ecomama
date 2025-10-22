package com.ecomama.modules.auth.application.usecase;

import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.domain.service.PasswordService;
import com.ecomama.modules.auth.infrastructure.security.JwtTokenProvider;
import com.ecomama.modules.auth.presentation.dto.AuthResponse;
import com.ecomama.modules.auth.presentation.dto.LoginRequest;
import com.ecomama.modules.auth.presentation.mapper.UserMapper;
import com.ecomama.shared.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoginUserUseCase {
    
    private final UserRepository userRepository;
    private final PasswordService passwordService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;
    
    @Transactional
    public AuthResponse execute(LoginRequest request) {
        log.info("User login attempt: {}", request.email());
        
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        
        if (!user.isActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }
        
        if (!passwordService.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        
        user.recordLogin();
        userRepository.save(user);
        
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());
        
        log.info("User logged in successfully: {}", user.getId());
        
        return new AuthResponse(
                accessToken,
                refreshToken,
                userMapper.toUserResponse(user)
        );
    }
}
