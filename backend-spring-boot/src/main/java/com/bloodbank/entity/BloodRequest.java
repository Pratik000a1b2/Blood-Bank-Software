package com.bloodbank.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodRequest {

    @Id
    @Column(name = "request_id", length = 50)
    private String requestId; // e.g., BBR-2026-000123

    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;

    @NotBlank(message = "Patient name is required")
    @Column(name = "patient_name", nullable = false, length = 120)
    private String patientName;

    @Column(name = "patient_age", nullable = false)
    private Integer patientAge;

    @Column(name = "gender", nullable = false, length = 10)
    private String gender;

    @Column(name = "blood_group", nullable = false, length = 10)
    private String bloodGroup;

    @Min(value = 1, message = "At least 1 unit must be requested")
    @Column(name = "required_units", nullable = false)
    private Integer requiredUnits;

    @NotBlank(message = "Hospital name is required")
    @Column(name = "hospital_name", nullable = false, length = 150)
    private String hospitalName;

    @Column(name = "hospital_address", columnDefinition = "TEXT")
    private String hospitalAddress;

    @Column(name = "city", nullable = false, length = 80)
    private String city;

    @Column(name = "attendant_name", nullable = false, length = 120)
    private String attendantName;

    @Column(name = "attendant_mobile", nullable = false, length = 15)
    private String attendantMobile;

    @Column(name = "required_date", nullable = false)
    private LocalDate requiredDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "emergency_level", nullable = false, length = 20)
    private EmergencyLevel emergencyLevel;

    @Column(name = "additional_information", columnDefinition = "TEXT")
    private String additionalInformation;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RequestStatus status = RequestStatus.Pending;

    @Column(name = "blood_bank_id", length = 50)
    private String bloodBankId;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejected_reason", columnDefinition = "TEXT")
    private String rejectedReason;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum EmergencyLevel {
        Normal, Urgent, Critical
    }

    public enum RequestStatus {
        Pending, Approved, Rejected, Processing, Completed
    }
}
