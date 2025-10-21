package com.ecomama.modules.auth.infrastructure.persistence;

import com.ecomama.modules.auth.domain.User;
import com.ecomama.modules.auth.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepository {
    
    private final JpaUserRepository jpaUserRepository;
    
    @Override
    public Optional<User> findById(UUID id) {
        return jpaUserRepository.findById(id);
    }
    
    @Override
    public Optional<User> findByEmail(String email) {
        return jpaUserRepository.findByEmail(email);
    }
    
    @Override
    public Optional<User> findByEmailVerificationToken(String token) {
        return jpaUserRepository.findByEmailVerificationToken(token);
    }
    
    @Override
    public Optional<User> findByPasswordResetToken(String token) {
        return jpaUserRepository.findByPasswordResetToken(token);
    }
    
    @Override
    public boolean existsByEmail(String email) {
        return jpaUserRepository.existsByEmail(email);
    }
    
    @Override
    public User save(User user) {
        return jpaUserRepository.save(user);
    }
    
    @Override
    public void delete(User user) {
        jpaUserRepository.delete(user);
    }
}
