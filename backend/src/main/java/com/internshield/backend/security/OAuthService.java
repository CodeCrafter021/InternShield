package com.internshield.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Finishes the "Sign in with Google / GitHub" flow.
 * The browser sends us the one-time `code`; we trade it for the user's verified
 * profile using the client SECRET (which never leaves the server).
 */
@Service
public class OAuthService {

    public record OAuthProfile(String provider, String providerId, String email, String name, String avatar) {}

    private static final ParameterizedTypeReference<Map<String, Object>> MAP = new ParameterizedTypeReference<>() {};
    private static final ParameterizedTypeReference<List<Map<String, Object>>> LIST = new ParameterizedTypeReference<>() {};

    private final RestClient http = RestClient.create();

    @Value("${app.oauth.google.client-id}") private String googleId;
    @Value("${app.oauth.google.client-secret}") private String googleSecret;
    @Value("${app.oauth.github.client-id}") private String githubId;
    @Value("${app.oauth.github.client-secret}") private String githubSecret;

    public OAuthProfile fetchProfile(String provider, String code, String redirectUri) {
        return switch (provider) {
            case "google" -> google(code, redirectUri);
            case "github" -> github(code, redirectUri);
            default -> throw new IllegalArgumentException("Unsupported provider");
        };
    }

    // ───────────── Google ─────────────
    private OAuthProfile google(String code, String redirectUri) {
        requireConfigured(googleId, googleSecret, "Google");

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("code", code);
        form.add("client_id", googleId);
        form.add("client_secret", googleSecret);
        form.add("redirect_uri", redirectUri);
        form.add("grant_type", "authorization_code");

        Map<String, Object> token = http.post()
                .uri("https://oauth2.googleapis.com/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form).retrieve().body(MAP);
        String accessToken = str(token, "access_token");

        Map<String, Object> info = http.get()
                .uri("https://openidconnect.googleapis.com/v1/userinfo")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve().body(MAP);

        if (!Boolean.TRUE.equals(info.get("email_verified"))) {
            throw new IllegalArgumentException("Your Google email is not verified");
        }
        return new OAuthProfile("google", str(info, "sub"), str(info, "email").toLowerCase(),
                str(info, "name"), str(info, "picture"));
    }

    // ───────────── GitHub ─────────────
    private OAuthProfile github(String code, String redirectUri) {
        requireConfigured(githubId, githubSecret, "GitHub");

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("client_id", githubId);
        form.add("client_secret", githubSecret);
        form.add("code", code);
        form.add("redirect_uri", redirectUri);

        Map<String, Object> token = http.post()
                .uri("https://github.com/login/oauth/access_token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .accept(MediaType.APPLICATION_JSON)
                .body(form).retrieve().body(MAP);
        String accessToken = str(token, "access_token");
        if (accessToken.isEmpty()) throw new IllegalArgumentException("GitHub sign-in failed");

        Map<String, Object> user = http.get().uri("https://api.github.com/user")
                .header("Authorization", "Bearer " + accessToken)
                .accept(MediaType.APPLICATION_JSON).retrieve().body(MAP);

        // The profile email can be private -> ask the emails endpoint for the primary verified one
        String email = str(user, "email");
        if (email.isEmpty()) {
            List<Map<String, Object>> emails = http.get().uri("https://api.github.com/user/emails")
                    .header("Authorization", "Bearer " + accessToken)
                    .accept(MediaType.APPLICATION_JSON).retrieve().body(LIST);
            if (emails != null) {
                for (Map<String, Object> e : emails) {
                    if (Boolean.TRUE.equals(e.get("primary")) && Boolean.TRUE.equals(e.get("verified"))) {
                        email = str(e, "email");
                        break;
                    }
                }
            }
        }
        if (email.isEmpty()) throw new IllegalArgumentException("No verified email found on your GitHub account");

        String name = str(user, "name");
        if (name.isEmpty()) name = str(user, "login");
        return new OAuthProfile("github", String.valueOf(user.get("id")), email.toLowerCase(),
                name, str(user, "avatar_url"));
    }

    private static void requireConfigured(String id, String secret, String label) {
        if (id == null || id.isBlank() || secret == null || secret.isBlank()) {
            throw new IllegalStateException(label + " sign-in is not configured on the server");
        }
    }

    private static String str(Map<String, Object> m, String k) {
        Object v = m == null ? null : m.get(k);
        return v == null ? "" : v.toString();
    }
}
