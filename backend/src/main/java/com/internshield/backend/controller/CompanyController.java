package com.internshield.backend.controller;

import com.internshield.backend.model.Company;
import com.internshield.backend.repository.CompanyRepository;
import com.internshield.backend.repository.ScamReportRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "*")
public class CompanyController
{
    
    private final CompanyRepository companyRepository;
    private final ScamReportRepository scamReportRepository;

    public CompanyController(CompanyRepository companyRepository, ScamReportRepository scamReportRepository)
    {
        this.companyRepository = companyRepository;
        this.scamReportRepository = scamReportRepository;
    }

    // Save a new company
    @PostMapping
    public Company addCompany(@RequestBody Company company) {
        return companyRepository.save(company);
    }

    // Get all companies
    @GetMapping
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    // Verify a company by name (Endpoint: /api/companies/verify?name=Google)
    @GetMapping("/verify")
    public ResponseEntity<?> verifyCompany(@RequestParam String name)
    {
        Company company = companyRepository.findByCompanyNameIgnoreCase(name);
        if (company != null)
        {
            long reportCount = scamReportRepository.countByCompanyId(company.getId());
            if (reportCount >= 5) {
                company.setSafetyStatus("Red");
            } else if (reportCount >= 1) {
                company.setSafetyStatus("Yellow");
            } else {
                company.setSafetyStatus("Green");
            }
            companyRepository.save(company);
            return ResponseEntity.ok(company);
        } else
        {
            return ResponseEntity.status(404).body("Company not found in our database.");
        }
    }
}