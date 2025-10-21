package com.ecomama.modules.auth.application.usecase;

import com.ecomama.modules.auth.application.service.EmailService;
import com.ecomama.modules.auth.domain.Profile;
import com.ecomama.modules.auth.domain.Role;
import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.domain.service.PasswordService;
import com.ecomama.modules.auth.presentation.dto.AuthResponse;
import com.ecomama.modules.auth.presentation.dto.RegisterRequest;
import com.ecomama.modules.auth.presentation.mapper.UserMapper;
import com.ecomama.modules.auth.infrastructure.security.JwtTokenProvider;
import com.ecomama.shared.exception.ConflictException;
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
public class RegisterUserUseCase {
    
    private final UserRepository userRepository;
    private final PasswordService passwordService;
    private final EmailService emailService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;
    
    @Transactional
    public AuthResponse execute(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.email());
        
        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email already registered");
        }
        
        passwordService.validatePassword(request.password());
        
        String passwordHash = passwordService.hashPassword(request.password());
        String verificationToken = TokenGenerator.generateSecureToken();
        Instant tokenExpiry = Instant.now().plus(24, ChronoUnit.HOURS);
        
        Profile profile = Profile.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .preferredLocale(request.preferredLocale())
                .build();
        
        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordHash)
                .role(Role.USER)
                .profile(profile)
                .emailVerified(false)
                .active(true)
                .build();
        
        user.setEmailVerificationToken(verificationToken, tokenExpiry);
        
        User savedUser = userRepository.save(user);
        
        emailService.sendVerificationEmail(
                savedUser.getEmail(),
                savedUser.getProfile().getFirstName(),
                verificationToken,
                savedUser.getProfile().getPreferredLocale()
        );
        
        String accessToken = jwtTokenProvider.generateAccessToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser.getId());
        
        log.info("User registered successfully: {}", savedUser.getId());
        
        return new AuthResponse(
                accessToken,
                refreshToken,
                userMapper.toUserResponse(savedUser)
        );
    }
}
