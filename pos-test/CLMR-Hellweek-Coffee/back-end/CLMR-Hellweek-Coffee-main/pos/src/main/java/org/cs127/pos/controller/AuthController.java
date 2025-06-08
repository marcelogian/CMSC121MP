package org.cs127.pos.controller;

import org.cs127.pos.dto.*;
import org.cs127.pos.entity.*;
import org.cs127.pos.repository.UserRepository;
import org.cs127.pos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Convert role string (from request) to enum Role if needed
        Role role;
        try {
            role = Role.valueOf(request.getRole().name().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role");
        }

        Optional<User> userOpt = userService.authenticate(request.getUsername(), request.getPassword(), role);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(new LoginResponse("Login successful", user));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials or role.");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            User created = userService.signup(request);
            return ResponseEntity.ok(Map.of(
                    "message", "User created",
                    "username", created.getUsername()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Signup failed: " + e.getMessage()
            ));
        }
    }


}
