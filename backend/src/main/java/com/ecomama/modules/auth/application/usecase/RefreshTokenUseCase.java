package com.ecomama.modules.auth.application.usecase;

import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.infrastructure.security.JwtTokenProvider;
import com.ecomama.modules.auth.presentation.dto.AuthResponse;
import com.ecomama.modules.auth.presentation.dto.RefreshTokenRequest;
import com.ecomama.modules.auth.presentation.mapper.UserMapper;
import com.ecomama.shared.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenUseCase {
    
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;
    
    public AuthResponse execute(RefreshTokenRequest request) {
        if (!jwtTokenProvider.validateRefreshToken(request.refreshToken())) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }
        
        UUID userId = jwtTokenProvider.getUserIdFromToken(request.refreshToken());
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        
        if (!user.isActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }
        
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());
        
        log.info("Token refreshed for user: {}", userId);
        
        return new AuthResponse(
                accessToken,
                refreshToken,
                userMapper.toUserResponse(user)
        );
    }
}
