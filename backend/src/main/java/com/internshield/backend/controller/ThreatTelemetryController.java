package com.internshield.backend.controller;

import com.internshield.backend.security.ThreatTelemetryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/telemetry")
public class ThreatTelemetryController {

    private final ThreatTelemetryService telemetry;

    public ThreatTelemetryController(ThreatTelemetryService telemetry) {
        this.telemetry = telemetry;
    }

    @PostMapping("/check")
    public ResponseEntity<?> recordCheck(@RequestBody Map<String, String> body, Authentication authentication) {
        try {
            telemetry.record(authentication.getName(), body.get("riskCategory"));
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
