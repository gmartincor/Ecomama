package com.ecomama.modules.auth.domain.repository;

import com.ecomama.modules.auth.domain.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    
    Optional<User> findById(UUID id);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    User save(User user);
    
    void delete(User user);
}
