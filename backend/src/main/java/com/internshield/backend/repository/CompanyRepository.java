package com.internshield.backend.repository;

import com.internshield.backend.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    
    // Find a company by its name (case-insensitive)
    Company findByCompanyNameIgnoreCase(String companyName);
    List<Company> findByCompanyNameContainingIgnoreCase(String name);
}