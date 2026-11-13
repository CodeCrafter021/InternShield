package com.internshield.backend.controller;

import com.internshield.backend.security.PasswordResetService;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/password-reset")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/request")
    public ResponseEntity<?> request(@RequestBody Map<String, String> body) {
        try {
            passwordResetService.requestCode(body.get("email"));
            return ResponseEntity.ok(Map.of("message", "If the account supports password sign-in, a code has been emailed."));
        } catch (MailException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Could not send the email. Check the mail server configuration and try again."));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {
        if (!passwordResetService.verifyCode(body.get("email"), body.get("code"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired code."));
        }
        return ResponseEntity.ok(Map.of("verified", true));
    }

    @PostMapping("/complete")
    public ResponseEntity<?> complete(@RequestBody Map<String, String> body) {
        if (!passwordResetService.resetPassword(body.get("email"), body.get("code"), body.get("newPassword"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired code, or password does not meet requirements."));
        }
        return ResponseEntity.ok(Map.of("success", true));
    }
}
