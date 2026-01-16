package com.arpon007.netflixclone.controller;

// Import necessary classes
import com.arpon007.netflixclone.DTO.request.UserRatingRequest;
import com.arpon007.netflixclone.Service.UserRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST Controller for managing User Ratings.
 * Handles HTTP requests related to rating videos.
 */
@RestController // Marks this class as a Restoration Controller, handling JSON
                // requests/responses
@RequestMapping("/api/ratings") // Base URL path for all endpoints in this controller
@RequiredArgsConstructor // Automatically injects final fields via constructor
public class UserRatingController {

    private final UserRatingService userRatingService; // Service for business logic

    /**
     * Endpoint to submit or update a rating for a video.
     * Expects a JSON body with videoId and rating.
     *
     * @param request The request body containing rating details.
     * @return ResponseEntity containing the saved rating.
     */
    @PostMapping // Maps HTTTP POST requests to this method
    public ResponseEntity<?> rateVideo(@RequestBody UserRatingRequest request) {
        // Retrieve the currently authenticated user's email from the Security Context
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        // Call service to process the rating and return the result wrapped in
        // ResponseEntity.ok()
        return ResponseEntity.ok(userRatingService.rateVideo(email, request));
    }

    /**
     * Endpoint to get rating statistics (average and count) for a specific video.
     * Publicly accessible (as configured in SecurityConfig).
     *
     * @param videoId The ID of the video from the URL path.
     * @return ResponseEntity containing a map with "average" and "count".
     */
    @GetMapping("/video/{videoId}/stats") // Maps HTTP GET requests with path variable
    public ResponseEntity<Map<String, Object>> getVideoStats(@PathVariable Long videoId) {
        // Return statistics fetched from the service
        return ResponseEntity.ok(userRatingService.getVideoRatingStats(videoId));
    }

    /**
     * Endpoint to get the current user's rating for a specific video.
     * Checks if the user is authenticated; if not (anonymous), returns 0.
     *
     * @param videoId The ID of the video.
     * @return ResponseEntity containing the user's rating (1-5) or 0.
     */
    @GetMapping("/video/{videoId}/user") // Maps HTTP GET requests
    public ResponseEntity<Integer> getUserRating(@PathVariable Long videoId) {
        // Get the current user's username/email
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Check if the user is unauthenticated (Spring Security default for anonymous)
        if ("anonymousUser".equals(email)) {
            // Return 0 if user is not logged in, indicating no rating
            return ResponseEntity.ok(0);
        }

        // Return the user's specific rating from service
        return ResponseEntity.ok(userRatingService.getUserRating(email, videoId));
    }
}
