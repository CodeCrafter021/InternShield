package com.internshield.backend.controller;

import com.internshield.backend.model.ScamReport;
import com.internshield.backend.repository.ScamReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ScamReportController {

    @Autowired
    private ScamReportRepository scamReportRepository;

    // 1. To submit a new Sakam report (POST)
    @PostMapping
    public ScamReport submitReport(@RequestBody ScamReport scamReport) {
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
}