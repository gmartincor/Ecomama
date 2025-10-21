package com.ecomama.modules.auth.domain.repository;

import com.ecomama.modules.auth.domain.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    
    Optional<User> findById(UUID id);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailVerificationToken(String token);
    
    Optional<User> findByPasswordResetToken(String token);
    
    boolean existsByEmail(String email);
    
    User save(User user);
    
    void delete(User user);
}
