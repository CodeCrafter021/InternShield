package com.internshield.backend.repository;

import com.internshield.backend.model.ScamReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface ScamReportRepository extends JpaRepository<ScamReport, Long> {
    List<ScamReport> findByCompanyId(Long companyId);
    List<ScamReport> findByCompanyNameIgnoreCase(String companyName);
    long countByCompanyId(Long companyId);
    List<ScamReport> findByReportedAtAfterOrderByReportedAtDesc(LocalDateTime reportedAfter);
}