package com.ecomama.modules.auth.application.usecase;

import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import com.ecomama.modules.auth.presentation.dto.UpdateProfileRequest;
import com.ecomama.modules.auth.presentation.dto.UserResponse;
import com.ecomama.modules.auth.presentation.mapper.ProfileMapper;
import com.ecomama.modules.auth.presentation.mapper.UserMapper;
import com.ecomama.shared.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UpdateProfileUseCase {
    
    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;
    private final UserMapper userMapper;
    
    @Transactional
    public UserResponse execute(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        user.updateProfile(profileMapper.toProfile(request));
        
        User updatedUser = userRepository.save(user);
        
        log.info("Profile updated for user: {}", userId);
        
        return userMapper.toUserResponse(updatedUser);
    }
}
