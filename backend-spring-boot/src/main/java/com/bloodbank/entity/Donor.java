package com.bloodbank.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donor {

    @Id
    @Column(name = "donor_id", length = 50)
    private String donorId;

    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;

    @Column(name = "blood_group", nullable = false, length = 10)
    private String bloodGroup;

    @Min(value = 18, message = "Donor must be at least 18 years old")
    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "gender", nullable = false, length = 10)
    private String gender;

    @DecimalMin(value = "45.0", message = "Donor weight must be at least 45 kg")
    @Column(name = "weight", nullable = false, precision = 5, scale = 2)
    private BigDecimal weight;

    @NotBlank
    @Column(name = "mobile", nullable = false, length = 15)
    private String mobile;

    @Column(name = "city", nullable = false, length = 80)
    private String city;

    @Column(name = "address", columnDefinition = "TEXT", nullable = false)
    private String address;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    @Column(name = "preferred_donation_date", nullable = false)
    private LocalDate preferredDonationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private DonorStatus status = DonorStatus.Pending;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum DonorStatus {
        Pending, Approved, Rejected
    }
}
