package com.internshield.backend.repository;

import com.internshield.backend.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSessionRepository extends JpaRepository<UserSession, String> {
    List<UserSession> findByEmailAndRevokedAtIsNullOrderByLastActiveAtDesc(String email);
    Optional<UserSession> findByIdAndEmailAndRevokedAtIsNull(String id, String email);
    boolean existsByIdAndEmailAndRevokedAtIsNull(String id, String email);
    void deleteByEmail(String email);
}
