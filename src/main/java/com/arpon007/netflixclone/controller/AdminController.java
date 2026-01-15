package com.arpon007.netflixclone.controller;

import com.arpon007.netflixclone.DTO.request.SuspendUserRequest;
import com.arpon007.netflixclone.DTO.response.MessageResponse;
import com.arpon007.netflixclone.DTO.response.UserResponse;
import com.arpon007.netflixclone.Service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    /**
     * Get all users
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Get user by ID
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        UserResponse user = adminService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    /**
     * Suspend or activate a user
     */
    @PutMapping("/users/suspend")
    public ResponseEntity<MessageResponse> suspendUser(@Valid @RequestBody SuspendUserRequest request) {
        MessageResponse response = adminService.suspendUser(
                request.getUserId(),
                request.getActive(),
                request.getReason()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a user
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable Long userId) {
        MessageResponse response = adminService.deleteUser(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Update user role
     */
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<MessageResponse> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String role) {
        MessageResponse response = adminService.updateUserRole(userId, role);
        return ResponseEntity.ok(response);
    }
}
