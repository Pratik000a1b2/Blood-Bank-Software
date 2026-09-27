package com.bloodbank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BloodBankApplication {

    public static void main(String[] args) {
        SpringApplication.run(BloodBankApplication.class, args);
        System.out.println("==================================================");
        System.out.println(" Blood Bank Management System API running on :8080");
        System.out.println(" Database: blood_bank_db (MySQL)");
        System.out.println("==================================================");
    }
}
