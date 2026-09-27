package com.bloodbank.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodInventory {

    @Id
    @Column(name = "inventory_id", length = 50)
    private String inventoryId;

    @Column(name = "blood_bank_id", nullable = false, length = 50)
    private String bloodBankId;

    @Column(name = "blood_group", nullable = false, length = 10)
    private String bloodGroup;

    @Min(0)
    @Column(name = "available_units", nullable = false)
    private Integer availableUnits = 0;

    @Min(0)
    @Column(name = "reserved_units", nullable = false)
    private Integer reservedUnits = 0;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
