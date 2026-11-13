package com.internshield.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.internshield.backend.model.User;
import com.internshield.backend.repository.UserRepository;
import com.internshield.backend.security.JwtUtil;
import com.internshield.backend.security.TwoFactorService;
import com.internshield.backend.security.UserSessionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/account")
public class AccountSecurityController {

    private static final Map<String, Object> DEFAULT_SETTINGS = Map.of(
            "twoFactorEnabled", false,
            "incognitoVerification", false,
            "telemetrySharing", true,
            "scamAlertsEmail", true,
            "weeklyThreatDigest", true,
            "communityAlerts", true,
            "discordWebhook", "",
            "apiKey", "");
    private static final Set<String> SETTING_KEYS = DEFAULT_SETTINGS.keySet();
    private static final Set<String> PREFERENCE_KEYS = Set.of(
            "incognitoVerification", "telemetrySharing", "scamAlertsEmail",
            "weeklyThreatDigest", "communityAlerts", "discordWebhook", "apiKey");

    private final UserRepository users;
    private final UserSessionService sessions;
    private final TwoFactorService twoFactor;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AccountSecurityController(UserRepository users, UserSessionService sessions,
                                     TwoFactorService twoFactor, JwtUtil jwtUtil) {
        this.users = users;
        this.sessions = sessions;
        this.twoFactor = twoFactor;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/settings")
    public ResponseEntity<?> getSettings(Authentication auth) {
        User user = findUser(auth.getName());
        if (user == null) return error(404, "User not found");
        return ResponseEntity.ok(settingsFor(user));
    }

    @PutMapping("/settings")
    public ResponseEntity<?> updateSettings(Authentication auth, @RequestBody Map<String, Object> updates) {
        User user = findUser(auth.getName());
        if (user == null) return error(404, "User not found");
        if (!PREFERENCE_KEYS.containsAll(updates.keySet())) return error(400, "Unsupported setting.");

        Map<String, Object> merged = settingsFor(user);
        merged.putAll(updates);
        if (!validWebhook(merged.get("discordWebhook"))) {
            return error(400, "Enter a valid HTTPS webhook URL.");
        }
        try {
            user.setSettingsJson(objectMapper.writeValueAsString(merged));
            users.save(user);
            return ResponseEntity.ok(merged);
        } catch (JsonProcessingException e) {
            return error(500, "Could not save account settings.");
        }
    }

    @GetMapping("/sessions")
    public ResponseEntity<?> listSessions(Authentication auth, HttpServletRequest request) {
        return ResponseEntity.ok(sessions.list(auth.getName(), currentSessionId(request)));
    }

    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<?> revokeSession(Authentication auth, @PathVariable String id) {
        return sessions.revoke(auth.getName(), id)
                ? ResponseEntity.ok(Map.of("revoked", true))
                : error(404, "Session not found.");
    }

    @PostMapping("/sessions/revoke-others")
    public ResponseEntity<?> revokeOtherSessions(Authentication auth, HttpServletRequest request) {
        int revoked = sessions.revokeOthers(auth.getName(), currentSessionId(request));
        return ResponseEntity.ok(Map.of("revoked", revoked));
    }

    @PostMapping("/2fa/setup")
    public ResponseEntity<?> setupTwoFactor(Authentication auth) {
        User user = findUser(auth.getName());
        if (user == null) return error(404, "User not found");
        if (user.isTwoFactorEnabled()) return error(409, "Two-factor authentication is already enabled.");

        String secret = twoFactor.newSecret();
        user.setPendingTotpSecret(secret);
        users.save(user);
        String uri = twoFactor.provisioningUri(user.getEmail(), secret);
        return ResponseEntity.ok(Map.of(
                "secret", secret,
                "otpauthUri", uri,
                "qrCodeDataUrl", twoFactor.qrCodeDataUrl(uri)));
    }

    @PostMapping("/2fa/enable")
    public ResponseEntity<?> enableTwoFactor(Authentication auth, @RequestBody Map<String, String> body) {
        User user = findUser(auth.getName());
        if (user == null) return error(404, "User not found");
        if (user.getPendingTotpSecret() == null
                || !twoFactor.verify(user.getPendingTotpSecret(), body.get("code"))) {
            return error(400, "Enter the current code from your authenticator app.");
        }
        user.setTotpSecret(user.getPendingTotpSecret());
        user.setPendingTotpSecret(null);
        user.setTwoFactorEnabled(true);
        users.save(user);
        return ResponseEntity.ok(Map.of("twoFactorEnabled", true));
    }

    @PostMapping("/2fa/disable")
    public ResponseEntity<?> disableTwoFactor(Authentication auth, @RequestBody Map<String, String> body) {
        User user = findUser(auth.getName());
        if (user == null) return error(404, "User not found");
        if (!user.isTwoFactorEnabled() || !twoFactor.verify(user.getTotpSecret(), body.get("code"))) {
            return error(400, "Enter a valid authenticator code to disable two-factor authentication.");
        }
        user.setTwoFactorEnabled(false);
        user.setTotpSecret(null);
        user.setPendingTotpSecret(null);
        users.save(user);
        return ResponseEntity.ok(Map.of("twoFactorEnabled", false));
    }

    private User findUser(String email) {
        return users.findByEmail(email).orElse(null);
    }

    private Map<String, Object> settingsFor(User user) {
        Map<String, Object> result = new LinkedHashMap<>(DEFAULT_SETTINGS);
        try {
            if (user.getSettingsJson() != null && !user.getSettingsJson().isBlank()) {
                Map<String, Object> stored = objectMapper.readValue(
                        user.getSettingsJson(), new TypeReference<>() {});
                stored.keySet().retainAll(SETTING_KEYS);
                result.putAll(stored);
            }
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Could not read saved account settings.", e);
        }
        result.put("twoFactorEnabled", user.isTwoFactorEnabled());
        return result;
    }

    private static boolean validWebhook(Object value) {
        if (!(value instanceof String url) || url.isBlank()) return true;
        try {
            URI parsed = URI.create(url.trim());
            return "https".equalsIgnoreCase(parsed.getScheme()) && parsed.getHost() != null;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private String currentSessionId(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) return null;
        return jwtUtil.extractSessionId(header.substring(7));
    }

    private static ResponseEntity<?> error(int status, String message) {
        return ResponseEntity.status(status).body(Map.of("error", message));
    }
}
