export interface SourceFile {
  path: string;
  category: 'MySQL Schema' | 'Spring Boot Backend' | 'Android XML Frontend' | 'Android Java Backend' | 'Setup Guide';
  language: 'sql' | 'java' | 'xml' | 'properties' | 'markdown';
  content: string;
}

export const SOURCE_CODE_FILES: SourceFile[] = [
  {
    path: 'database/schema.sql',
    category: 'MySQL Schema',
    language: 'sql',
    content: `-- =======================================================
-- BLOOD BANK MANAGEMENT SYSTEM - MYSQL SCHEMA
-- Database: blood_bank_db (MySQL 8.0+)
-- =======================================================

CREATE DATABASE IF NOT EXISTS blood_bank_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blood_bank_db;

-- 1. Users Table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'STAFF', 'ADMIN') NOT NULL DEFAULT 'USER',
    date_of_birth DATE NULL,
    gender ENUM('Male', 'Female', 'Other') NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NULL,
    address TEXT NULL,
    city VARCHAR(80) NOT NULL,
    state VARCHAR(80) NULL,
    pincode VARCHAR(10) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_mobile (mobile)
) ENGINE=InnoDB;

-- 2. Blood Banks Table
CREATE TABLE blood_banks (
    blood_bank_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    registration_number VARCHAR(80) NOT NULL UNIQUE,
    contact_number VARCHAR(30) NOT NULL,
    email VARCHAR(120) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(80) NOT NULL,
    state VARCHAR(80) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    opening_time VARCHAR(50) DEFAULT '08:00 AM',
    closing_time VARCHAR(50) DEFAULT '08:00 PM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Donors Table
CREATE TABLE donors (
    donor_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    city VARCHAR(80) NOT NULL,
    address TEXT NOT NULL,
    last_donation_date DATE NULL,
    preferred_donation_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_donor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Blood Inventory Table
CREATE TABLE blood_inventory (
    inventory_id VARCHAR(50) PRIMARY KEY,
    blood_bank_id VARCHAR(50) NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    available_units INT NOT NULL DEFAULT 0,
    reserved_units INT NOT NULL DEFAULT 0,
    expiry_date DATE NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_bank FOREIGN KEY (blood_bank_id) REFERENCES blood_banks(blood_bank_id) ON DELETE CASCADE,
    CONSTRAINT chk_units CHECK (available_units >= 0 AND reserved_units >= 0)
) ENGINE=InnoDB;

-- 5. Blood Requests Table
CREATE TABLE blood_requests (
    request_id VARCHAR(50) PRIMARY KEY, -- e.g. BBR-2026-000123
    user_id VARCHAR(50) NOT NULL,
    patient_name VARCHAR(120) NOT NULL,
    patient_age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    required_units INT NOT NULL DEFAULT 1,
    hospital_name VARCHAR(150) NOT NULL,
    hospital_address TEXT NOT NULL,
    city VARCHAR(80) NOT NULL,
    attendant_name VARCHAR(120) NOT NULL,
    attendant_mobile VARCHAR(15) NOT NULL,
    required_date DATE NOT NULL,
    emergency_level ENUM('Normal', 'Urgent', 'Critical') NOT NULL DEFAULT 'Normal',
    additional_information TEXT NULL,
    status ENUM('Pending', 'Approved', 'Rejected', 'Processing', 'Completed') NOT NULL DEFAULT 'Pending',
    blood_bank_id VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_req_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;`
  },
  {
    path: 'backend-spring-boot/src/main/resources/application.properties',
    category: 'Spring Boot Backend',
    language: 'properties',
    content: `# Spring Boot Server Port
server.port=8080
server.servlet.context-path=/api

# MySQL DataSource
spring.datasource.url=jdbc:mysql://localhost:3306/blood_bank_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=rootpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT Auth Secret
jwt.secret=9a4f2c8d7e1b5a3f0e8c6b4a2d9e1f3a5b7c9d0e2f4a6b8c0d1e3f5a7b9c1d3e
jwt.expirationMs=86400000`
  },
  {
    path: 'backend-spring-boot/src/main/java/com/bloodbank/controller/BloodRequestController.java',
    category: 'Spring Boot Backend',
    language: 'java',
    content: `package com.bloodbank.controller;

import com.bloodbank.entity.BloodRequest;
import com.bloodbank.service.BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/requests")
@CrossOrigin(origins = "*")
public class BloodRequestController {

    @Autowired
    private BloodRequestService requestService;

    @PostMapping
    public ResponseEntity<?> submitRequest(@RequestBody BloodRequest request) {
        BloodRequest saved = requestService.createRequest(request);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<BloodRequest>> getRequests(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(requestService.filterRequests(userId, status));
    }

    @PutMapping("/{requestId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String requestId,
            @RequestParam String status) {
        BloodRequest updated = requestService.updateStatusWithStockCheck(requestId, status);
        return ResponseEntity.ok(updated);
    }
}`
  },
  {
    path: 'android-app/res/layout/item_blood_group.xml',
    category: 'Android XML Frontend',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/card_blood_group"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_margin="8dp"
    app:cardCornerRadius="14dp"
    app:cardElevation="2dp"
    app:strokeColor="#E2E8F0"
    app:strokeWidth="1dp"
    app:cardBackgroundColor="@android:color/white">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp"
        android:gravity="center">

        <TextView
            android:id="@+id/tv_blood_group"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="O+"
            android:textSize="22sp"
            android:textStyle="bold"
            android:textColor="#DC2626" />

        <TextView
            android:id="@+id/tv_available_units"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:text="30 Units"
            android:textSize="18sp"
            android:textStyle="bold"
            android:textColor="#0F172A" />

        <TextView
            android:id="@+id/tv_status_badge"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="4dp"
            android:text="Available"
            android:textSize="12sp"
            android:textColor="#16A34A" />
    </LinearLayout>
</com.google.android.material.card.MaterialCardView>`
  },
  {
    path: 'android-app/src/main/java/com/bloodbank/adapter/BloodGroupAdapter.java',
    category: 'Android Java Backend',
    language: 'java',
    content: `package com.bloodbank.adapter;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bloodbank.R;
import com.bloodbank.model.BloodGroupModel;
import java.util.List;

public class BloodGroupAdapter extends RecyclerView.Adapter<BloodGroupAdapter.ViewHolder> {
    private final Context context;
    private final List<BloodGroupModel> list;

    public BloodGroupAdapter(Context context, List<BloodGroupModel> list) {
        this.context = context;
        this.list = list;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_blood_group, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        BloodGroupModel item = list.get(position);
        holder.tvGroup.setText(item.getGroup());
        holder.tvUnits.setText(item.getUnits() + " Units");
        holder.tvStatus.setText(item.getUnits() > 0 ? "Available" : "Not Available");
        holder.tvStatus.setTextColor(item.getUnits() > 0 ? Color.parseColor("#16A34A") : Color.parseColor("#DC2626"));
    }

    @Override
    public int getItemCount() { return list.size(); }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvGroup, tvUnits, tvStatus;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvGroup = itemView.findViewById(R.id.tv_blood_group);
            tvUnits = itemView.findViewById(R.id.tv_available_units);
            tvStatus = itemView.findViewById(R.id.tv_status_badge);
        }
    }
}`
  },
  {
    path: 'SETUP_GUIDE.md',
    category: 'Setup Guide',
    language: 'markdown',
    content: `# Blood Bank Management System - Setup & Execution Guide

## 1. Prerequisites
- **JDK 17+** (Java Development Kit)
- **MySQL Server 8.0+**
- **Maven 3.8+**
- **Android Studio** (Electric Eel or newer) or Web Browser

---

## 2. Database Setup (MySQL)
1. Open MySQL terminal or MySQL Workbench:
   \`\`\`bash
   mysql -u root -p
   \`\`\`
2. Run the schema creation script:
   \`\`\`sql
   SOURCE database/schema.sql;
   SOURCE database/seed.sql;
   \`\`\`
3. Verify tables created:
   \`\`\`sql
   USE blood_bank_db;
   SHOW TABLES;
   \`\`\`

---

## 3. Spring Boot Backend Execution
1. Navigate to the backend folder:
   \`\`\`bash
   cd backend-spring-boot
   \`\`\`
2. Configure credentials in \`src/main/resources/application.properties\`:
   \`\`\`properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   \`\`\`
3. Build and run:
   \`\`\`bash
   mvn clean spring-boot:run
   \`\`\`
4. REST API will start at: \`http://localhost:8080/api\`

---

## 4. Default Demo Accounts
- **Admin**: \`admin@bloodbank.org\` / Password: \`admin123\`
- **Blood Bank Staff**: \`staff@bloodbank.org\` / Password: \`staff123\`
- **User/Donor**: \`donor@gmail.com\` / Password: \`donor123\`

---

## 5. Key REST API Endpoints
- **POST** \`/api/auth/login\` - User/Staff/Admin authentication
- **POST** \`/api/auth/register\` - Donor/User registration
- **GET** \`/api/blood/availability\` - Live availability for all 8 blood groups
- **POST** \`/api/requests\` - Submit blood request (generates \`BBR-2026-XXXXXX\`)
- **PUT** \`/api/requests/{id}/status\` - Approve request with auto-deduct stock
- **GET** \`/api/inventory\` - Blood inventory per blood bank`
  }
];
