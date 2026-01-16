package com.arpon007.netflixclone.controller;

import com.arpon007.netflixclone.DTO.request.UpdateFavoriteCategoriesRequest;
import com.arpon007.netflixclone.DTO.request.UpdateProfileRequest;
import com.arpon007.netflixclone.DTO.response.MessageResponse;
import com.arpon007.netflixclone.DTO.response.UserResponse;
import com.arpon007.netflixclone.DTO.response.VideoResponse;
import com.arpon007.netflixclone.Service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get user profile
     */
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.getUserProfile(email));
    }

    /**
     * Update user profile (name and email)
     */
    @PutMapping("/profile")
    public ResponseEntity<MessageResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.updateProfile(email, request));
    }

    /**
     * Upload user avatar
     */
    @PostMapping("/avatar")
    public ResponseEntity<MessageResponse> uploadAvatar(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.uploadAvatar(email, file));
    }

    /**
     * Delete user account
     */
    @DeleteMapping("/account")
    public ResponseEntity<MessageResponse> deleteAccount() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.deleteAccount(email));
    }

    /**
     * Update favorite categories (max 3)
     */
    @PutMapping("/favorite-categories")
    public ResponseEntity<MessageResponse> updateFavoriteCategories(
            @Valid @RequestBody UpdateFavoriteCategoriesRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.updateFavoriteCategories(email, request.getFavoriteCategories()));
    }

    /**
     * Add video to watchlist
     */
    @PostMapping("/watchlist/{videoId}")
    public ResponseEntity<MessageResponse> addToWatchlist(@PathVariable Long videoId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.addToWatchlist(email, videoId));
    }

    /**
     * Remove video from watchlist
     */
    @DeleteMapping("/watchlist/{videoId}")
    public ResponseEntity<MessageResponse> removeFromWatchlist(@PathVariable Long videoId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.removeFromWatchlist(email, videoId));
    }

    /**
     * Get user's watchlist
     */
    @GetMapping("/watchlist")
    public ResponseEntity<List<VideoResponse>> getWatchlist() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.getWatchlist(email));
    }

    /**
     * Record video view (called when user opens/watches a video)
     */
    @PostMapping("/videos/{videoId}/view")
    public ResponseEntity<MessageResponse> recordView(@PathVariable Long videoId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.recordVideoView(email, videoId));
    }

    /**
     * Get video view count
     */
    @GetMapping("/videos/{videoId}/views")
    public ResponseEntity<Long> getViewCount(@PathVariable Long videoId) {
        return ResponseEntity.ok(userService.getVideoViewCount(videoId));
    }
}
