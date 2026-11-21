package com.internshield.backend.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.internshield.backend.model.ScamReport;
import com.internshield.backend.model.User;
import com.internshield.backend.repository.ScamReportRepository;
import com.internshield.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AccountNotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AccountNotificationService.class);

    private final UserRepository users;
    private final ScamReportRepository reports;
    private final JavaMailSender mailSender;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String fromAddress;
    private final boolean enabled;

    public AccountNotificationService(
            UserRepository users,
            ScamReportRepository reports,
            JavaMailSender mailSender,
            @Value("${app.mail.from}") String fromAddress,
            @Value("${app.mail.notifications-enabled:false}") boolean enabled) {
        this.users = users;
        this.reports = reports;
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.enabled = enabled;
    }

    public void sendCriticalScamAlert(String companyName) {
        sendToSubscribers("scamAlertsEmail", user -> {
            SimpleMailMessage message = messageFor(user);
            message.setSubject("Critical internship scam alert: " + companyName);
            message.setText("InternShield has flagged " + companyName
                    + " as critical after multiple community reports. Do not send money or personal documents "
                    + "until you verify the opportunity through official company channels.");
            mailSender.send(message);
        });
    }

    @Scheduled(cron = "0 0 9 * * MON", zone = "UTC")
    public void sendWeeklyThreatDigest() {
        if (!enabled) return;
        List<ScamReport> recentReports = reports.findByReportedAtAfterOrderByReportedAtDesc(
                LocalDateTime.now().minusDays(7));
        if (recentReports.isEmpty()) return;

        String reportSummary = recentReports.stream()
                .map(report -> "- " + safe(report.getCompanyName()) + " (" + safe(report.getScamType()) + ")")
                .reduce((first, next) -> first + "\n" + next)
                .orElse("");
        sendToSubscribers("weeklyThreatDigest", user -> {
            SimpleMailMessage message = messageFor(user);
            message.setSubject("Your weekly InternShield threat digest");
            message.setText("Community scam reports from the last seven days:\n\n" + reportSummary
                    + "\n\nReview every internship offer carefully and never pay an upfront recruitment fee.");
            mailSender.send(message);
        });
    }

    private void sendToSubscribers(String setting, java.util.function.Consumer<User> send) {
        if (!enabled) return;
        for (User user : users.findAll()) {
            if (!isEnabled(user, setting)) continue;
            try {
                send.accept(user);
            } catch (MailException e) {
                LOGGER.error("Could not send an account notification email.", e);
            }
        }
    }

    private boolean isEnabled(User user, String setting) {
        if (user.getEmail() == null || user.getEmail().isBlank()) return false;
        String storedSettings = user.getSettingsJson();
        if (storedSettings == null || storedSettings.isBlank()) {
            return "scamAlertsEmail".equals(setting) || "weeklyThreatDigest".equals(setting);
        }
        try {
            JsonNode preferences = objectMapper.readTree(storedSettings);
            if (preferences != null && preferences.has(setting)) {
                return preferences.path(setting).asBoolean(false);
            }
            return "scamAlertsEmail".equals(setting) || "weeklyThreatDigest".equals(setting);
        } catch (Exception e) {
            LOGGER.warn("Skipping notification for an account with unreadable preferences.");
            return false;
        }
    }

    private SimpleMailMessage messageFor(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(user.getEmail());
        return message;
    }

    private static String safe(String value) {
        return value == null || value.isBlank() ? "Unspecified" : value.replaceAll("[\\r\\n]", " ");
    }
}
