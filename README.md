# Blood Bank Management System

A digital, full-stack healthcare web application and reference architecture connecting voluntary blood donors, clinical patients, and accredited blood banks.

---

## 1. System Architecture & Tech Stack

```
[Android XML / Web UI] ──(HTTP / REST JSON)──> [Spring Boot 3.2 Backend] ──(JPA / Hibernate)──> [MySQL 8.0+ DB]
```

### Frontend
- **Web Application**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide Icons
- **Android Mobile UI Reference**: Material Design XML components (`CardView`, `RecyclerView`, `TextInputLayout`, `BottomNavigationView`, `MaterialToolbar`, `ExtendedFloatingActionButton`)

### Backend
- **Java 17 & Spring Boot 3.2+** REST APIs:
  - Spring Data JPA & Hibernate
  - Spring Security with BCrypt Password Hashing & Stateless JWT Authentication
  - Bean Validation (`@Valid`, `@NotBlank`, `@Email`, `@Min`)
  - Exception handling with structured JSON error responses

### Database
- **MySQL 8.0+** relational database: `blood_bank_db`
- Complete DDL (`database/schema.sql`) and DML (`database/seed.sql`)

---

## 2. Default Demo Credentials

| Role | Email / Mobile | Default Password | Initial Scope / Access |
|---|---|---|---|
| **System Administrator** | `admin@bloodbank.org` / `9820011223` | `admin123` | Full administrative control, donor verification, inventory overview, facility registry, analytics |
| **Blood Bank Staff** | `staff@bloodbank.org` / `9820033445` | `staff123` | Stock additions, unit reservations, expiration purging, requisition approvals |
| **Donor / User** | `donor@gmail.com` / `9876543210` | `donor123` | Profile management, donor registration, blood requisition tracking, educational guidelines |

*(Note: In the live web preview, you can switch between any of these roles in 1 click using the top simulation bar or the quick demo buttons on the login modal).*

---

## 3. Database Setup (MySQL)

1. Connect to your MySQL server:
   ```bash
   mysql -u root -p
   ```
2. Execute the schema script:
   ```sql
   SOURCE database/schema.sql;
   SOURCE database/seed.sql;
   ```
3. Verify that all 7 tables exist:
   ```sql
   USE blood_bank_db;
   SHOW TABLES;
   ```
   Tables:
   - `users`
   - `blood_banks`
   - `donors`
   - `blood_inventory`
   - `blood_requests`
   - `donations`
   - `notifications`

---

## 4. Spring Boot Backend Execution

1. Change directory to the backend repository:
   ```bash
   cd backend-spring-boot
   ```
2. Configure credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/blood_bank_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```
3. Run the Spring Boot application using Maven:
   ```bash
   mvn clean spring-boot:run
   ```
4. Verify the backend is listening at `http://localhost:8080/api`.

---

## 5. REST API Endpoints Specification

### Authentication
- `POST /api/auth/register` — Register a new donor or patient account
- `POST /api/auth/login` — Authenticate and retrieve JWT token
- `POST /api/auth/logout` — Terminate user session

### Blood Availability & Inventory
- `GET /api/blood/availability` — Aggregate units across all 8 blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `GET /api/blood/{bloodGroup}` — Filter availability for a specific blood group
- `GET /api/inventory` — Full stock inventory by blood bank
- `POST /api/inventory` — Add units to a blood bank's stock
- `PUT /api/inventory/{id}` — Update available and reserved units
- `DELETE /api/inventory/{id}` — Remove inventory record

### Donors
- `POST /api/donors` — Submit voluntary donor registration
- `GET /api/donors` — Query donors with filter by group, city, and status
- `GET /api/donors/{id}` — Get donor profile and donation history
- `PUT /api/donors/{id}` — Approve or reject donor registration
- `DELETE /api/donors/{id}` — Delete donor profile

### Blood Requests
- `POST /api/requests` — Submit a clinical blood requisition (generates format: `BBR-2026-XXXXXX`)
- `GET /api/requests` — Retrieve requisitions (filtered by user, status, priority)
- `GET /api/requests/{id}` — Inspect requisition clinical information
- `PUT /api/requests/{id}/status` — Update status (`Approved`, `Rejected`, `Processing`, `Completed`) with **automatic inventory stock deduction and negative stock prevention**

### Blood Banks
- `GET /api/blood-banks` — List accredited facilities with operating hours and contact
- `POST /api/blood-banks` — Register new blood bank center
- `PUT /api/blood-banks/{id}` — Update facility details
- `DELETE /api/blood-banks/{id}` — Decommission blood bank facility

---

## 6. Key Business & Clinical Logic Implemented

1. **Automatic Stock Deduction with Negative Balance Prevention**:
   When staff or admin approves a blood request (`status = 'Approved'`), the system checks if `availableUnits >= requiredUnits`.
   - If sufficient: Available units are reduced and reserved units are increased atomically.
   - If insufficient: The approval is blocked with a clear warning explaining the deficit and requiring stock replenishment.
2. **Sequential Unique Request ID**:
   Every request generates an ID in format `BBR-2026-000101` for clinical traceability.
3. **Multi-Role RBAC**:
   Role-based authorization for User/Donor, Blood Bank Staff, and Admin.
4. **Interactive Architecture Hub**:
   The web application includes an embedded code viewer that displays the exact Spring Boot Java classes, MySQL scripts, and Android layout XML files with one-click copy and download functionality.
