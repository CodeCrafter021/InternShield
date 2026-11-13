package com.internshield.backend.security;

import com.internshield.backend.model.PasswordResetOtp;
import com.internshield.backend.model.User;
import com.internshield.backend.repository.PasswordResetOtpRepository;
import com.internshield.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Locale;
import java.util.Optional;

@Service
public class PasswordResetService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository users;
    private final PasswordResetOtpRepository otps;
    private final UserSessionService sessions;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final String fromAddress;

    public PasswordResetService(UserRepository users, PasswordResetOtpRepository otps,
                                UserSessionService sessions, PasswordEncoder passwordEncoder,
                                JavaMailSender mailSender,
                                @Value("${app.mail.from}") String fromAddress) {
        this.users = users;
        this.otps = otps;
        this.sessions = sessions;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    @Transactional
    public void requestCode(String emailInput) {
        String email = normalize(emailInput);
        Optional<User> matchingUser = users.findByEmail(email);
        if (matchingUser.isEmpty() || matchingUser.get().getPassword() == null) return;

        Instant now = Instant.now();
        PasswordResetOtp record = otps.findByEmail(email).orElseGet(PasswordResetOtp::new);
        if (record.getSentAt() != null && record.getSentAt().isAfter(now.minusSeconds(60))) return;

        String code = String.format(Locale.ROOT, "%06d", RANDOM.nextInt(1_000_000));
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(email);
        message.setSubject("Your InternShield password reset code");
        message.setText("Your password reset code is " + code
                + ". It expires in 10 minutes. If you did not request this, you can ignore this email.");
        mailSender.send(message);

        record.setEmail(email);
        record.setCodeHash(passwordEncoder.encode(code));
        record.setSentAt(now);
        record.setExpiresAt(now.plusSeconds(600));
        record.setAttempts(0);
        otps.save(record);
    }

    @Transactional
    public boolean verifyCode(String emailInput, String code) {
        String email = normalize(emailInput);
        PasswordResetOtp record = otps.findByEmail(email).orElse(null);
        if (!isUsable(record)) return false;
        if (record.getAttempts() >= 5) return false;
        if (!passwordEncoder.matches(code == null ? "" : code.trim(), record.getCodeHash())) {
            record.setAttempts(record.getAttempts() + 1);
            otps.save(record);
            return false;
        }
        return true;
    }

    @Transactional
    public boolean resetPassword(String emailInput, String code, String newPassword) {
        if (newPassword == null || newPassword.length() < 8) return false;
        String email = normalize(emailInput);
        if (!verifyCode(email, code)) return false;
        User user = users.findByEmail(email).orElse(null);
        if (user == null || user.getPassword() == null) return false;
        user.setPassword(passwordEncoder.encode(newPassword));
        users.save(user);
        otps.deleteByEmail(email);
        sessions.revokeAll(email);
        return true;
    }

    private static boolean isUsable(PasswordResetOtp record) {
        return record != null && record.getExpiresAt().isAfter(Instant.now());
    }

    private static String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

}
