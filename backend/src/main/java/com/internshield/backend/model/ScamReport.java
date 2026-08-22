package com.internshield.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "scam_reports")
public class ScamReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long companyId;        // ← ADD: link to company
    private String companyName;
    private String scamType;
    private String description;
    private String contactInfo;

    @Column(updatable = false)
    private LocalDateTime reportedAt;   // ← ADD: timestamp

    @PrePersist
    protected void onCreate() {
        this.reportedAt = LocalDateTime.now();
    }

    // Default Constructor
    public ScamReport() {}

    // Getters & Setters 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getScamType() { return scamType; }
    public void setScamType(String scamType) { this.scamType = scamType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public LocalDateTime getReportedAt() { return reportedAt; }
}