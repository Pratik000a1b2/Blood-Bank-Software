package com.bloodbank.controller;

import com.bloodbank.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        user.setId("usr-" + UUID.randomUUID().toString().substring(0, 8));
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "User registered successfully");
        res.put("userId", user.getId());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        String role = credentials.get("role");

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("token", "jwt-token-sample-" + System.currentTimeMillis());
        res.put("user", Map.of(
            "email", email,
            "role", role != null ? role : "USER",
            "fullName", "Demo User"
        ));
        return ResponseEntity.ok(res);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("success", true, "message", "Logged out successfully"));
    }
}
