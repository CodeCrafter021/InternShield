package com.internshield.backend.controller;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.internshield.backend.model.User;
import com.internshield.backend.repository.UserRepository;
import com.internshield.backend.security.JwtUtil;
import com.internshield.backend.security.OAuthService;
import com.internshield.backend.security.OAuthService.OAuthProfile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    private static final Set<String> PROVIDERS = Set.of("google", "github");

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final OAuthService oAuthService;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder, OAuthService oAuthService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.oAuthService = oAuthService;
    }

    // ── Register ──
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = clean(body.get("email")).toLowerCase();
        String password = body.get("password") == null ? "" : body.get("password");
        String name = clean(body.get("name"));

        if (!EMAIL.matcher(email).matches()) return error("Enter a valid email address");
        if (password.length() < 8) return error("Password must be at least 8 characters");
        if (userRepository.existsByEmail(email)) return error("An account with this email already exists");

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name.isEmpty() ? email.split("@")[0] : name);
        user.setProvider("password");
        userRepository.save(user);

        return ResponseEntity.ok(session(user));
    }

    // ── Login ──
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = clean(body.get("email")).toLowerCase();
        String password = body.get("password") == null ? "" : body.get("password");

        User user = userRepository.findByEmail(email).orElse(null);
        // Same message for "no such user" and "wrong password" -> no account enumeration
        if (user == null || user.getPassword() == null
                || !passwordEncoder.matches(password, user.getPassword())) {
            if (user != null && user.getPassword() == null) {
                return error("This account uses " + user.getProvider() + " sign-in. Use that button instead.");
            }
            return error("Invalid email or password");
        }
        return ResponseEntity.ok(session(user));
    }

    // ── Google / GitHub ──
    @PostMapping("/oauth/{provider}")
    public ResponseEntity<?> oauth(@PathVariable String provider, @RequestBody Map<String, String> body) {
        if (!PROVIDERS.contains(provider)) return error("Unsupported provider");
        String code = clean(body.get("code"));
        String redirectUri = clean(body.get("redirectUri"));
        if (code.isEmpty() || redirectUri.isEmpty()) return error("Missing code");

        OAuthProfile p;
        try {
            p = oAuthService.fetchProfile(provider, code, redirectUri);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return error(e.getMessage());
        } catch (Exception e) {
            return error("Sign-in with " + provider + " failed. Please try again.");
        }

        // Existing account with the same (provider-verified) email is reused, otherwise create one
        User user = userRepository.findByEmail(p.email()).orElseGet(() -> {
            User u = new User();
            u.setEmail(p.email());
            u.setProvider(p.provider());
            u.setProviderId(p.providerId());
            return u;
        });
        if (user.getName() == null || user.getName().isBlank()) user.setName(p.name());
        user.setAvatarUrl(p.avatar());
        userRepository.save(user);

        return ResponseEntity.ok(session(user));
    }

    // ── Profile ──
    @GetMapping("/profile")
    public ResponseEntity<?> profile(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(profileMap(u)))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    // ── Delete account (removes everything we hold about the user) ──
    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(Authentication auth) {
        userRepository.findByEmail(auth.getName()).ifPresent(userRepository::delete);
        return ResponseEntity.ok(Map.of("message", "Account deleted"));
    }

    // ── helpers ──
    private Map<String, Object> session(User u) {
        Map<String, Object> m = profileMap(u);
        m.put("token", jwtUtil.generateToken(u.getEmail()));
        return m;
    }

    private Map<String, Object> profileMap(User u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("email", u.getEmail());
        m.put("name", u.getName() == null ? "" : u.getName());
        m.put("avatar", u.getAvatarUrl() == null ? "" : u.getAvatarUrl());
        m.put("provider", u.getProvider() == null ? "password" : u.getProvider());
        return m;
    }

    private static ResponseEntity<?> error(String msg) {
        return ResponseEntity.badRequest().body(Map.of("error", msg));
    }

    private static String clean(String s) {
        return s == null ? "" : s.trim();
    }
}
