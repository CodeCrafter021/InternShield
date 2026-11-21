package com.internshield.backend.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.internshield.backend.model.ThreatTelemetry;
import com.internshield.backend.model.User;
import com.internshield.backend.repository.ThreatTelemetryRepository;
import com.internshield.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class ThreatTelemetryService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ThreatTelemetryService.class);
    private static final Set<String> ALLOWED_CATEGORIES = Set.of("LOW", "MEDIUM", "HIGH");
    private final ThreatTelemetryRepository telemetry;
    private final UserRepository users;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ThreatTelemetryService(ThreatTelemetryRepository telemetry, UserRepository users) {
        this.telemetry = telemetry;
        this.users = users;
    }

    @Transactional
    public synchronized void record(String email, String riskCategory) {
        String category = riskCategory == null ? "" : riskCategory.trim().toUpperCase();
        if (!ALLOWED_CATEGORIES.contains(category)) {
            throw new IllegalArgumentException("Unsupported telemetry category.");
        }
        User user = users.findByEmail(email).orElse(null);
        if (user == null || !hasTelemetryConsent(user)) return;

        ThreatTelemetry aggregate = telemetry.findById(category).orElseGet(() -> {
            ThreatTelemetry item = new ThreatTelemetry();
            item.setRiskCategory(category);
            return item;
        });
        aggregate.setEventCount(aggregate.getEventCount() + 1);
        telemetry.save(aggregate);
    }

    private boolean hasTelemetryConsent(User user) {
        if (user.getTelemetryConsentVersion() < 1) return false;
        try {
            JsonNode preferences = objectMapper.readTree(user.getSettingsJson());
            return preferences != null
                    && preferences.path("telemetrySharing").asBoolean(false)
                    && !preferences.path("incognitoVerification").asBoolean(false);
        } catch (Exception e) {
            LOGGER.warn("Skipping telemetry for an account with unreadable preferences.");
            return false;
        }
    }
}
