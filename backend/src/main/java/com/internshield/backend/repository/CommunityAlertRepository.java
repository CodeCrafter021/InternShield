package com.internshield.backend.repository;

import com.internshield.backend.model.CommunityAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommunityAlertRepository extends JpaRepository<CommunityAlert, Long> {
    List<CommunityAlert> findAllByOrderByCreatedAtDesc();
}