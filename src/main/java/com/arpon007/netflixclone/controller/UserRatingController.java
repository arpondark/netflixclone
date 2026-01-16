package com.arpon007.netflixclone.controller;

import com.arpon007.netflixclone.DTO.request.UserRatingRequest;
import com.arpon007.netflixclone.Service.UserRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class UserRatingController {

    private final UserRatingService userRatingService;

    @PostMapping
    public ResponseEntity<?> rateVideo(@RequestBody UserRatingRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userRatingService.rateVideo(email, request));
    }

    @GetMapping("/video/{videoId}/stats")
    public ResponseEntity<Map<String, Object>> getVideoStats(@PathVariable Long videoId) {
        return ResponseEntity.ok(userRatingService.getVideoRatingStats(videoId));
    }

    @GetMapping("/video/{videoId}/user")
    public ResponseEntity<Integer> getUserRating(@PathVariable Long videoId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        // If user is not authenticated (anonymousUser), return 0
        if ("anonymousUser".equals(email)) {
            return ResponseEntity.ok(0);
        }
        return ResponseEntity.ok(userRatingService.getUserRating(email, videoId));
    }
}
