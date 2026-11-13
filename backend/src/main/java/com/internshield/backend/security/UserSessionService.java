package com.internshield.backend.security;

import com.internshield.backend.model.User;
import com.internshield.backend.model.UserSession;
import com.internshield.backend.repository.UserSessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class UserSessionService {

    private final UserSessionRepository sessions;
    private final JwtUtil jwtUtil;

    public UserSessionService(UserSessionRepository sessions, JwtUtil jwtUtil) {
        this.sessions = sessions;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public Map<String, Object> create(User user, HttpServletRequest request) {
        String id = UUID.randomUUID().toString();
        Instant now = Instant.now();
        UserSession session = new UserSession();
        session.setId(id);
        session.setEmail(user.getEmail());
        String userAgent = request.getHeader("User-Agent");
        session.setUserAgent(userAgent == null ? "" : userAgent.substring(0, Math.min(500, userAgent.length())));
        session.setCreatedAt(now);
        session.setLastActiveAt(now);
        sessions.save(session);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("email", user.getEmail());
        result.put("name", user.getName() == null ? "" : user.getName());
        result.put("avatar", user.getAvatarUrl() == null ? "" : user.getAvatarUrl());
        result.put("provider", user.getProvider() == null ? "password" : user.getProvider());
        result.put("twoFactorEnabled", user.isTwoFactorEnabled());
        result.put("sessionId", id);
        result.put("token", jwtUtil.generateToken(user.getEmail(), id));
        return result;
    }

    @Transactional
    public boolean touch(String id, String email) {
        if (id == null) return false;
        return sessions.findByIdAndEmailAndRevokedAtIsNull(id, email)
                .map(session -> {
                    if (session.getLastActiveAt().isBefore(Instant.now().minusSeconds(60))) {
                        session.setLastActiveAt(Instant.now());
                        sessions.save(session);
                    }
                    return true;
                })
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> list(String email, String currentId) {
        return sessions.findByEmailAndRevokedAtIsNullOrderByLastActiveAtDesc(email).stream()
                .map(session -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", session.getId());
                    item.put("device", session.getUserAgent() == null || session.getUserAgent().isBlank()
                            ? "Unknown device" : session.getUserAgent());
                    item.put("createdAt", session.getCreatedAt());
                    item.put("lastActiveAt", session.getLastActiveAt());
                    item.put("current", session.getId().equals(currentId));
                    return item;
                }).toList();
    }

    @Transactional
    public boolean revoke(String email, String id) {
        return sessions.findByIdAndEmailAndRevokedAtIsNull(id, email)
                .map(session -> {
                    session.setRevokedAt(Instant.now());
                    sessions.save(session);
                    return true;
                })
                .orElse(false);
    }

    @Transactional
    public int revokeOthers(String email, String currentId) {
        List<UserSession> active = sessions.findByEmailAndRevokedAtIsNullOrderByLastActiveAtDesc(email);
        Instant now = Instant.now();
        int revoked = 0;
        for (UserSession session : active) {
            if (!session.getId().equals(currentId)) {
                session.setRevokedAt(now);
                revoked++;
            }
        }
        sessions.saveAll(active);
        return revoked;
    }

    @Transactional
    public void revokeCurrent(String email, String id) {
        if (id != null) revoke(email, id);
    }

    @Transactional
    public void revokeAll(String email) {
        List<UserSession> active = sessions.findByEmailAndRevokedAtIsNullOrderByLastActiveAtDesc(email);
        Instant now = Instant.now();
        active.forEach(session -> session.setRevokedAt(now));
        sessions.saveAll(active);
    }
}
