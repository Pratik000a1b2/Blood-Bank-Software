-- =======================================================
-- BLOOD BANK MANAGEMENT SYSTEM - DATABASE SCHEMA
-- Database: blood_bank_db (MySQL 8.0+)
-- =======================================================

DROP DATABASE IF EXISTS blood_bank_db;
CREATE DATABASE blood_bank_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_mobile (mobile),
    INDEX idx_user_role (role)
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bank_city (city)
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
    CONSTRAINT fk_donor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_donor_blood_group (blood_group),
    INDEX idx_donor_status (status),
    INDEX idx_donor_city (city)
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
    CONSTRAINT fk_inventory_bank FOREIGN KEY (blood_bank_id) REFERENCES blood_banks(blood_bank_id) ON DELETE CASCADE,
    CONSTRAINT chk_units_non_negative CHECK (available_units >= 0 AND reserved_units >= 0),
    INDEX idx_inventory_group (blood_group),
    INDEX idx_inventory_bank (blood_bank_id)
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
    approved_at TIMESTAMP NULL,
    rejected_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_request_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_request_bank FOREIGN KEY (blood_bank_id) REFERENCES blood_banks(blood_bank_id) ON DELETE SET NULL,
    INDEX idx_request_status (status),
    INDEX idx_request_blood_group (blood_group),
    INDEX idx_request_emergency (emergency_level)
) ENGINE=InnoDB;

-- 6. Donations Table
CREATE TABLE donations (
    donation_id VARCHAR(50) PRIMARY KEY,
    donor_id VARCHAR(50) NOT NULL,
    blood_bank_id VARCHAR(50) NOT NULL,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    donation_date DATE NOT NULL,
    units INT NOT NULL DEFAULT 1,
    status ENUM('Completed', 'Scheduled', 'Cancelled') NOT NULL DEFAULT 'Completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_donation_donor FOREIGN KEY (donor_id) REFERENCES donors(donor_id) ON DELETE CASCADE,
    CONSTRAINT fk_donation_bank FOREIGN KEY (blood_bank_id) REFERENCES blood_banks(blood_bank_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Notifications Table
CREATE TABLE notifications (
    notification_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'alert') NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user_read (user_id, is_read)
) ENGINE=InnoDB;
