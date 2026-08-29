package com.internshield.backend.controller;

import com.internshield.backend.model.UserHistory;
import com.internshield.backend.repository.UserHistoryRepository;
import com.internshield.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
public class UserHistoryController {

    @Autowired
    private UserHistoryRepository userHistoryRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Get user history
    @GetMapping
    public ResponseEntity<?> getHistory(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }
        String email = jwtUtil.extractEmail(token);
        List<UserHistory> history = userHistoryRepository.findByUserEmailOrderByCheckedAtDesc(email);
        return ResponseEntity.ok(history);
    }

    // Add to history
    @PostMapping
    public ResponseEntity<?> addHistory(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }
        String email = jwtUtil.extractEmail(token);

        UserHistory history = new UserHistory();
        history.setUserEmail(email);
        history.setCompanyName((String) body.get("companyName"));
        history.setDomain((String) body.get("domain"));
        history.setRisk((String) body.get("risk"));
        history.setScore(body.get("score") != null ? Integer.parseInt(body.get("score").toString()) : 0);
        history.setCategory((String) body.get("category"));
        history.setCheckedAt(LocalDateTime.now());

        userHistoryRepository.save(history);
        return ResponseEntity.ok(Map.of("message", "History saved"));
    }

    // Clear user history
    @DeleteMapping
    public ResponseEntity<?> clearHistory(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }
        String email = jwtUtil.extractEmail(token);
        userHistoryRepository.deleteByUserEmail(email);
        return ResponseEntity.ok(Map.of("message", "History cleared"));
    }
}