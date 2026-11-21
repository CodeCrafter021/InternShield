package com.internshield.backend.security;

import com.internshield.backend.model.CommunityAlert;
import com.internshield.backend.model.Company;
import com.internshield.backend.model.ScamReport;
import com.internshield.backend.repository.CommunityAlertRepository;
import com.internshield.backend.repository.CompanyRepository;
import com.internshield.backend.repository.ScamReportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ThreatReportService {

    private static final long CRITICAL_REPORT_THRESHOLD = 5;

    private final ScamReportRepository reports;
    private final CommunityAlertRepository alerts;
    private final CompanyRepository companies;
    private final AccountNotificationService notifications;

    public ThreatReportService(ScamReportRepository reports, CommunityAlertRepository alerts,
                               CompanyRepository companies, AccountNotificationService notifications) {
        this.reports = reports;
        this.alerts = alerts;
        this.companies = companies;
        this.notifications = notifications;
    }

    public ScamReport submit(ScamReport report) {
        String companyName = clean(report.getCompanyName(), 150);
        if (companyName.isEmpty()) throw new IllegalArgumentException("Company name is required.");
        report.setCompanyName(companyName);
        report.setScamType(clean(report.getScamType(), 100));
        report.setDescription(clean(report.getDescription(), 2000));
        report.setContactInfo(clean(report.getContactInfo(), 200));
        report.setId(null);

        Company company = report.getCompanyId() == null
                ? companies.findByCompanyNameIgnoreCase(companyName)
                : companies.findById(report.getCompanyId()).orElse(null);
        if (company != null) report.setCompanyId(company.getId());

        ScamReport saved = reports.save(report);
        saveCommunityAlert(saved);

        if (company != null && reports.countByCompanyId(company.getId()) >= CRITICAL_REPORT_THRESHOLD
                && !"red".equalsIgnoreCase(company.getSafetyStatus())) {
            company.setSafetyStatus("Red");
            companies.save(company);
            notifications.sendCriticalScamAlert(company.getCompanyName());
        }
        return saved;
    }

    private void saveCommunityAlert(ScamReport report) {
        CommunityAlert alert = new CommunityAlert();
        alert.setTitle("Suspicious activity reported: " + report.getCompanyName());
        alert.setCompanyName(report.getCompanyName());
        alert.setReporter("Anonymous Student");
        alert.setSeverity("HIGH");
        alert.setDetail(report.getDescription());
        alert.setCreatedAt(report.getReportedAt() == null ? LocalDateTime.now() : report.getReportedAt());
        alerts.save(alert);
    }

    private static String clean(String value, int maxLength) {
        if (value == null) return "";
        String cleaned = value.trim().replaceAll("[\\r\\n]", " ");
        return cleaned.length() > maxLength ? cleaned.substring(0, maxLength) : cleaned;
    }
}
