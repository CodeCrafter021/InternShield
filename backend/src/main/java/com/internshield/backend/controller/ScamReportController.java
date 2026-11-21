package com.internshield.backend.controller;

import com.internshield.backend.model.ScamReport;
import com.internshield.backend.repository.ScamReportRepository;
import com.internshield.backend.security.ThreatReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ScamReportController {

    private final ScamReportRepository scamReportRepository;
    private final ThreatReportService threatReportService;

    public ScamReportController(ScamReportRepository scamReportRepository,
                                ThreatReportService threatReportService) {
        this.scamReportRepository = scamReportRepository;
        this.threatReportService = threatReportService;
    }

    @PostMapping
    public ResponseEntity<?> submitReport(@RequestBody ScamReport scamReport) {
        try {
            return ResponseEntity.ok(threatReportService.submit(scamReport));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    // Kept for authenticated moderation tools.
    @GetMapping
    public List<ScamReport> getAllReports() {
        return scamReportRepository.findAll();
    }

    @GetMapping("/company/{companyId}")
    public List<ScamReport> getReportsByCompany(@PathVariable Long companyId) {
        return scamReportRepository.findByCompanyId(companyId);
    }

}
