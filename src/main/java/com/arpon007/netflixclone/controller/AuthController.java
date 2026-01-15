package com.arpon007.netflixclone.controller;

import com.arpon007.netflixclone.DTO.request.*;
import com.arpon007.netflixclone.DTO.response.LoginResponse;
import com.arpon007.netflixclone.DTO.response.MessageResponse;
import com.arpon007.netflixclone.Service.AuthService;
import com.arpon007.netflixclone.dao.UserRepository;
import com.arpon007.netflixclone.entity.User;
import com.arpon007.netflixclone.enums.Role;
import com.arpon007.netflixclone.exception.BadCredentialException;
import com.arpon007.netflixclone.exception.EmailAlreadyExistsException;
import com.arpon007.netflixclone.exception.InvalidCredentialsExpection;
import com.arpon007.netflixclone.Security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    /**
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody UserRequest userRequest) {
        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(userRequest.getEmail());
        if (existingUser.isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists: " + userRequest.getEmail());
        }

        // Create new user
        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setFullName(userRequest.getFullName());
        user.setPassword(userRequest.getPassword()); // Note: Should be hashed in production
        user.setRole(userRequest.getRole() != null ? Role.valueOf(userRequest.getRole()) : Role.USER);
        user.setActive(userRequest.getActive() != null ? userRequest.getActive() : true);
        user.setEmailVerified(false);

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("User registered successfully"));
    }

    /**
     * Login user with email and password
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Find user by email
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty()) {
            throw new BadCredentialException("Invalid email or password");
        }

        User user = userOptional.get();

        // Check if user is active
        if (!user.isActive()) {
            throw new InvalidCredentialsExpection("Account is deactivated");
        }

        // Verify password (In production, use BCryptPasswordEncoder)
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new BadCredentialException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());

        // Return login response
        LoginResponse response = new LoginResponse(
                token,
                user.getEmail(),
                user.getFullName(),
                user.getRole().toString()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Forgot password - send password reset email
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody EmailRequest emailRequest) {
        MessageResponse response = authService.forgotPassword(emailRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Reset password using token
     */
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPassword resetPassword) {
        MessageResponse response = authService.resetPassword(resetPassword);
        return ResponseEntity.ok(response);
    }

    /**
     * Change password for authenticated user
     */
    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        MessageResponse response = authService.changePassword(changePasswordRequest, userEmail);
        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<MessageResponse> health() {
        return ResponseEntity.ok(new MessageResponse("Auth service is running"));
    }
}
