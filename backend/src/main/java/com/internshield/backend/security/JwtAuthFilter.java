package com.internshield.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/** Reads "Authorization: Bearer <jwt>" and marks the request as authenticated. */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserSessionService userSessionService;
    private final Set<String> adminEmails;

    public JwtAuthFilter(JwtUtil jwtUtil, UserSessionService userSessionService,
                         @Value("${app.admin-emails}") String admins) {
        this.jwtUtil = jwtUtil;
        this.userSessionService = userSessionService;
        this.adminEmails = Arrays.stream(admins.split(","))
                .map(String::trim).map(String::toLowerCase)
                .filter(s -> !s.isEmpty()).collect(Collectors.toSet());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.validateToken(token) && "access".equals(jwtUtil.extractPurpose(token))) {
                String email = jwtUtil.extractEmail(token);
                String sessionId = jwtUtil.extractSessionId(token);
                if (!userSessionService.touch(sessionId, email)) {
                    chain.doFilter(request, response);
                    return;
                }
                List<GrantedAuthority> roles = new ArrayList<>();
                roles.add(new SimpleGrantedAuthority("ROLE_USER"));
                if (adminEmails.contains(email.toLowerCase())) {
                    roles.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                }
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(email, null, roles));
            }
        }
        chain.doFilter(request, response);
    }
}
