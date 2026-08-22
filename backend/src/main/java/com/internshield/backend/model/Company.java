package com.internshield.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String gstNumber;
    private boolean mcaRegistered;
    private String safetyStatus; // "Green" (Safe), "Yellow" (Check), "Red" (Scam)

    // Default Constructor
    public Company() {}

    // Parameterized Constructor
    public Company(String companyName, String gstNumber, boolean mcaRegistered, String safetyStatus) {
        this.companyName = companyName;
        this.gstNumber = gstNumber;
        this.mcaRegistered = mcaRegistered;
        this.safetyStatus = safetyStatus;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getGstNumber() { return gstNumber; }
    public void setGstNumber(String gstNumber) { this.gstNumber = gstNumber; }

    public boolean isMcaRegistered() { return mcaRegistered; }
    public void setMcaRegistered(boolean mcaRegistered) { this.mcaRegistered = mcaRegistered; }

    public String getSafetyStatus() { return safetyStatus; }
    public void setSafetyStatus(String safetyStatus) { this.safetyStatus = safetyStatus; }
}