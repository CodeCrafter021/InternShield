package com.internshield.backend.controller;

import com.internshield.backend.model.ScamReport;
import com.internshield.backend.repository.ScamReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ScamReportController {

    @Autowired
    private ScamReportRepository scamReportRepository;

    // 1. To submit a new Sakam report (POST)
    @PostMapping
    public ScamReport submitReport(@RequestBody ScamReport scamReport) {
        // Reports are anonymous: we deliberately do NOT store who submitted them.
        scamReport.setId(null);
        scamReport.setCompanyName(limit(scamReport.getCompanyName(), 150));
        scamReport.setScamType(limit(scamReport.getScamType(), 100));
        scamReport.setDescription(limit(scamReport.getDescription(), 2000));
        scamReport.setContactInfo(limit(scamReport.getContactInfo(), 200));
        return scamReportRepository.save(scamReport);
    }

    // 2. To view all scam reports (GET)
    @GetMapping
    public List<ScamReport> getAllReports() {
        return scamReportRepository.findAll();
    }

    @GetMapping("/company/{companyId}")
    public List<ScamReport> getReportsByCompany(@PathVariable Long companyId) {
        return scamReportRepository.findByCompanyId(companyId);
    }

    private static String limit(String s, int max) {
        if (s == null) return null;
        s = s.trim();
        return s.length() > max ? s.substring(0, max) : s;
    }
}
