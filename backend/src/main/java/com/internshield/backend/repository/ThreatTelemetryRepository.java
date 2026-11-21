package com.internshield.backend.repository;

import com.internshield.backend.model.ThreatTelemetry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThreatTelemetryRepository extends JpaRepository<ThreatTelemetry, String> {
}
