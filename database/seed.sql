-- =======================================================
-- BLOOD BANK MANAGEMENT SYSTEM - SAMPLE DEMO SEED DATA
-- Database: blood_bank_db
-- =======================================================

USE blood_bank_db;

-- 1. Users (BCrypt hashed passwords for 'admin123', 'staff123', 'donor123')
INSERT INTO users (id, full_name, email, mobile, password_hash, role, date_of_birth, gender, blood_group, address, city, state, pincode) VALUES
('usr-admin-1', 'Dr. Rajesh Sharma', 'admin@bloodbank.org', '9820011223', '$2a$12$e6m0PqQ3E5G8m1n9k2t8x.k2yX2b1rO2A7fJ9m0pL4wZ1x3v5k7tq', 'ADMIN', '1980-05-14', 'Male', 'O+', 'Civil Hospital Road, Medical Enclave', 'Akola', 'Maharashtra', '444001'),
('usr-staff-1', 'Sister Anita Desai', 'staff@bloodbank.org', '9820033445', '$2a$12$e6m0PqQ3E5G8m1n9k2t8x.k2yX2b1rO2A7fJ9m0pL4wZ1x3v5k7tq', 'STAFF', '1988-11-20', 'Female', 'B+', 'Red Cross Center, Ramdas Peth', 'Akola', 'Maharashtra', '444002'),
('usr-donor-1', 'Pratik Panzade', 'donor@gmail.com', '9876543210', '$2a$12$e6m0PqQ3E5G8m1n9k2t8x.k2yX2b1rO2A7fJ9m0pL4wZ1x3v5k7tq', 'USER', '1998-07-22', 'Male', 'O+', 'Near Gandhi Chowk, Station Road', 'Akola', 'Maharashtra', '444001'),
('usr-donor-2', 'Priya Kulkarni', 'priya.k@example.com', '9811223344', '$2a$12$e6m0PqQ3E5G8m1n9k2t8x.k2yX2b1rO2A7fJ9m0pL4wZ1x3v5k7tq', 'USER', '1995-03-12', 'Female', 'A+', 'Plot 45, Shivaji Nagar', 'Pune', 'Maharashtra', '411005'),
('usr-donor-3', 'Rahul Verma', 'rahul.v@example.com', '9833445566', '$2a$12$e6m0PqQ3E5G8m1n9k2t8x.k2yX2b1rO2A7fJ9m0pL4wZ1x3v5k7tq', 'USER', '1992-09-18', 'Male', 'B-', '12-B Andheri West', 'Mumbai', 'Maharashtra', '400053');

-- 2. Blood Banks
INSERT INTO blood_banks (blood_bank_id, name, registration_number, contact_number, email, address, city, state, pincode, opening_time, closing_time) VALUES
('bb-akola-01', 'Akola District Central Red Cross Blood Centre', 'MH-BB-2019-0412', '+91 724 243 5590', 'redcross.akola@bloodbank.org', 'Opposite Government Medical College & Hospital', 'Akola', 'Maharashtra', '444001', '08:00 AM', '10:00 PM (24x7 Emergency)'),
('bb-pune-02', 'Sanjeevani Rotary Blood Bank', 'MH-BB-2015-1108', '+91 20 2567 8901', 'sanjeevani.pune@bloodbank.org', 'Near Deccan Gymkhana, F.C. Road', 'Pune', 'Maharashtra', '411004', '24 Hours', '24 Hours'),
('bb-mumbai-03', 'Metro Lifeline Blood Bank & Research Institute', 'MH-BB-2018-0955', '+91 22 2410 4400', 'metro.lifeline@bloodbank.org', 'Dr. E Moses Road, Worli', 'Mumbai', 'Maharashtra', '400018', '24 Hours', '24 Hours'),
('bb-delhi-04', 'Apex Charitable Blood Centre', 'DL-BB-2020-0331', '+91 11 2658 9000', 'apex.delhi@bloodbank.org', 'Ansari Nagar, Ring Road', 'Delhi', 'Delhi NCR', '110029', '24 Hours', '24 Hours');

-- 3. Blood Inventory
INSERT INTO blood_inventory (inventory_id, blood_bank_id, blood_group, available_units, reserved_units, expiry_date) VALUES
('inv-101', 'bb-akola-01', 'A+', 25, 3, '2026-10-25'),
('inv-102', 'bb-akola-01', 'A-', 10, 1, '2026-10-20'),
('inv-103', 'bb-akola-01', 'B+', 18, 2, '2026-10-28'),
('inv-104', 'bb-akola-01', 'B-', 5, 0, '2026-10-18'),
('inv-105', 'bb-akola-01', 'AB+', 12, 1, '2026-10-22'),
('inv-106', 'bb-akola-01', 'AB-', 4, 0, '2026-10-15'),
('inv-107', 'bb-akola-01', 'O+', 30, 4, '2026-10-30'),
('inv-108', 'bb-akola-01', 'O-', 8, 1, '2026-10-19'),
('inv-201', 'bb-pune-02', 'A+', 20, 2, '2026-10-26'),
('inv-202', 'bb-pune-02', 'B+', 24, 3, '2026-10-29'),
('inv-203', 'bb-pune-02', 'O+', 28, 5, '2026-10-27'),
('inv-204', 'bb-pune-02', 'O-', 6, 0, '2026-10-16');

-- 4. Donors
INSERT INTO donors (donor_id, user_id, blood_group, age, gender, weight, mobile, city, address, last_donation_date, preferred_donation_date, status) VALUES
('dnr-001', 'usr-donor-1', 'O+', 28, 'Male', 72.0, '9876543210', 'Akola', 'Near Gandhi Chowk, Station Road', '2026-04-10', '2026-10-05', 'Approved'),
('dnr-002', 'usr-donor-2', 'A+', 31, 'Female', 58.0, '9811223344', 'Pune', 'Plot 45, Shivaji Nagar', '2026-01-15', '2026-10-12', 'Approved'),
('dnr-003', 'usr-donor-3', 'B-', 34, 'Male', 68.0, '9833445566', 'Mumbai', '12-B Andheri West', '2025-11-20', '2026-10-02', 'Pending');

-- 5. Blood Requests
INSERT INTO blood_requests (request_id, user_id, patient_name, patient_age, gender, blood_group, required_units, hospital_name, hospital_address, city, attendant_name, attendant_mobile, required_date, emergency_level, additional_information, status, blood_bank_id) VALUES
('BBR-2026-000101', 'usr-donor-1', 'Rameshwar Panzade', 62, 'Male', 'O+', 2, 'Akola District Civil Hospital', 'GMC Campus, Civil Lines', 'Akola', 'Pratik Panzade', '9876543210', '2026-09-28', 'Urgent', 'Scheduled for orthopedic surgery.', 'Approved', 'bb-akola-01'),
('BBR-2026-000102', 'usr-donor-2', 'Sunita Kulkarni', 45, 'Female', 'A+', 1, 'Ruby Hall Clinic', 'Sassoon Road, Sangamvadi', 'Pune', 'Priya Kulkarni', '9811223344', '2026-09-29', 'Normal', 'Chemotherapy supportive transfusion.', 'Processing', 'bb-pune-02'),
('BBR-2026-000103', 'usr-donor-3', 'Farhan Sheikh', 29, 'Male', 'B-', 3, 'Kokilaben Dhirubhai Ambani Hospital', 'Rao Saheb Achutrao Marg', 'Mumbai', 'Tariq Sheikh', '9899001122', '2026-09-27', 'Critical', 'Road trauma ICU casualty with severe hemorrhage.', 'Pending', 'bb-mumbai-03');

-- 6. Donations
INSERT INTO donations (donation_id, donor_id, blood_bank_id, blood_group, donation_date, units, status) VALUES
('DON-2026-0901', 'dnr-001', 'bb-akola-01', 'O+', '2026-04-10', 1, 'Completed'),
('DON-2026-0902', 'dnr-002', 'bb-pune-02', 'A+', '2026-01-15', 1, 'Completed');

-- 7. Notifications
INSERT INTO notifications (notification_id, user_id, title, message, type, is_read) VALUES
('notif-1', 'usr-donor-1', 'Blood Request Approved', 'Your blood request BBR-2026-000101 (O+, 2 Units) has been approved by Akola District Central Red Cross Blood Centre.', 'success', 0),
('notif-2', 'usr-donor-1', 'Donor Registration Approved', 'Congratulations! Your blood donor profile is verified and approved.', 'info', 1),
('notif-3', 'usr-admin-1', 'Critical Emergency Blood Request', 'Critical request BBR-2026-000103 submitted for B- (3 Units) at Kokilaben Hospital Mumbai.', 'alert', 0);
