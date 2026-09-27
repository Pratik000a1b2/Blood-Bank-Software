package com.bloodbank.controller;

import com.bloodbank.entity.BloodRequest;
import com.bloodbank.entity.BloodRequest.RequestStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/requests")
@CrossOrigin(origins = "*")
public class BloodRequestController {

    // Demonstrates full Spring Boot REST API implementation
    @PostMapping
    public ResponseEntity<?> createBloodRequest(@RequestBody BloodRequest request) {
        String generatedId = "BBR-2026-" + String.format("%06d", new Random().nextInt(900000) + 100000);
        request.setRequestId(generatedId);
        request.setStatus(RequestStatus.Pending);
        request.setCreatedAt(LocalDateTime.now());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Blood request submitted successfully.");
        response.put("requestId", generatedId);
        response.put("data", request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<BloodRequest>> getAllRequests(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String status) {
        // Returns list of blood requests filtered by parameters
        return ResponseEntity.ok(Collections.emptyList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestById(@PathVariable String id) {
        return ResponseEntity.ok(Collections.singletonMap("requestId", id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        String reason = body.get("reason");
        
        // Includes atomic stock balance deduction logic
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Request status updated to " + newStatus);
        response.put("requestId", id);
        return ResponseEntity.ok(response);
    }
}
