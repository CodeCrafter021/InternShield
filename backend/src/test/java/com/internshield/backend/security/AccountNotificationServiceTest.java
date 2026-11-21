package com.internshield.backend.security;

import com.internshield.backend.model.ScamReport;
import com.internshield.backend.model.User;
import com.internshield.backend.repository.ScamReportRepository;
import com.internshield.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AccountNotificationServiceTest {

    private UserRepository users;
    private ScamReportRepository reports;
    private JavaMailSender mailSender;
    private AccountNotificationService notifications;

    @BeforeEach
    void setUp() {
        users = mock(UserRepository.class);
        reports = mock(ScamReportRepository.class);
        mailSender = mock(JavaMailSender.class);
        notifications = new AccountNotificationService(
                users, reports, mailSender, "alerts@example.com", true);
    }

    @Test
    void criticalAlertsOnlyReachUsersWhoEnabledThem() {
        User subscribed = user("alerts@example.com", "{\"scamAlertsEmail\":true}");
        User unsubscribed = user("no-alerts@example.com", "{\"scamAlertsEmail\":false}");
        when(users.findAll()).thenReturn(List.of(subscribed, unsubscribed));

        notifications.sendCriticalScamAlert("Example Corp");

        ArgumentCaptor<SimpleMailMessage> sent = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(sent.capture());
        assertEquals("alerts@example.com", sent.getValue().getTo()[0]);
    }

    @Test
    void weeklyDigestContainsRecentReportsAndHonorsPreference() {
        User subscribed = user("digest@example.com", "{\"weeklyThreatDigest\":true}");
        when(users.findAll()).thenReturn(List.of(subscribed));
        ScamReport report = new ScamReport();
        report.setCompanyName("Example Corp");
        report.setScamType("Upfront fee");
        when(reports.findByReportedAtAfterOrderByReportedAtDesc(any())).thenReturn(List.of(report));

        notifications.sendWeeklyThreatDigest();

        ArgumentCaptor<SimpleMailMessage> sent = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(sent.capture());
        assertEquals("digest@example.com", sent.getValue().getTo()[0]);
        org.junit.jupiter.api.Assertions.assertTrue(sent.getValue().getText().contains("Example Corp"));
    }

    @Test
    void weeklyDigestDoesNotSendWhenThereAreNoRecentReports() {
        when(reports.findByReportedAtAfterOrderByReportedAtDesc(any())).thenReturn(List.of());

        notifications.sendWeeklyThreatDigest();

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    private static User user(String email, String settings) {
        User user = new User();
        user.setEmail(email);
        user.setSettingsJson(settings);
        return user;
    }
}
