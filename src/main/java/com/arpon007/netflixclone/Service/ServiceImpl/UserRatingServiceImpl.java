package com.arpon007.netflixclone.Service.ServiceImpl;

// Import necessary dependencies
import com.arpon007.netflixclone.DTO.request.UserRatingRequest;
import com.arpon007.netflixclone.dao.UserRatingRepository;
import com.arpon007.netflixclone.dao.UserRepository;
import com.arpon007.netflixclone.dao.VideoRepository;
import com.arpon007.netflixclone.entity.User;
import com.arpon007.netflixclone.entity.UserRating;
import com.arpon007.netflixclone.entity.Video;
import com.arpon007.netflixclone.exception.ResourceNotFoundExCeption;
import com.arpon007.netflixclone.Service.UserRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Implementation of the UserRatingService interface.
 * Handles the actual business logic for video ratings.
 */
@Service // Marks this class as a Spring Service component
@RequiredArgsConstructor // Lombok annotation to generate a constructor with required (final) arguments
                         // for dependency injection
public class UserRatingServiceImpl implements UserRatingService {

    // Injected repositories for database access
    private final UserRatingRepository userRatingRepository;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;

    /**
     * Implements the logic to rate a video.
     * Creates a new rating or updates an existing one if the user has already rated
     * the video.
     */
    @Override
    @Transactional // Ensures the method executes within a database transaction
    public UserRating rateVideo(String userEmail, UserRatingRequest request) {
        // Fetch the user by email, throw exception if not found
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found"));

        // Fetch the video by ID, throw exception if not found
        Video video = videoRepository.findById(Long.valueOf(request.getVideoId()))
                .orElseThrow(() -> new ResourceNotFoundExCeption("Video not found"));

        // Validate that the rating is within the allowed range (1-5)
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Check if a rating already exists for this user and video
        Optional<UserRating> existingRating = userRatingRepository.findByUserIdAndVideoId(user.getId(),
                video.getVideo_id());

        UserRating rating;
        if (existingRating.isPresent()) {
            // Update existing rating if found
            rating = existingRating.get();
            rating.setRating(request.getRating());
        } else {
            // Create a new rating if none exists
            rating = new UserRating();
            rating.setUser(user);
            rating.setVideo(video);
            rating.setRating(request.getRating());
        }

        // Save and return the rating entity
        return userRatingRepository.save(rating);
    }

    /**
     * Implements the logic to get rating statistics (average and count).
     */
    @Override
    public Map<String, Object> getVideoRatingStats(Long videoId) {
        // Fetch average rating from repository
        Double average = userRatingRepository.getAverageRating(videoId);
        // Fetch total count of ratings from repository
        Long count = userRatingRepository.countByVideoId(videoId);

        // Prepare the response map
        Map<String, Object> stats = new HashMap<>();
        // Handle null average (if no ratings exist) by defaulting to 0.0
        stats.put("average", average != null ? average : 0.0);
        stats.put("count", count != null ? count : 0);
        return stats;
    }

    /**
     * Implements the logic to get a specific user's rating for a video.
     */
    @Override
    public Integer getUserRating(String userEmail, Long videoId) {
        // Fetch the user by email
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found"));

        // Find the rating and map it to its integer value, or return 0 if not found
        return userRatingRepository.findByUserIdAndVideoId(user.getId(), videoId)
                .map(UserRating::getRating)
                .orElse(0);
    }
}
