package com.internshield.backend.repository;

import com.internshield.backend.model.UserHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserHistoryRepository extends JpaRepository<UserHistory, Long> {
    List<UserHistory> findByUserEmailOrderByCheckedAtDesc(String userEmail);
    void deleteByUserEmail(String userEmail);
}