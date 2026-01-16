package com.arpon007.netflixclone.Service;

// Import necessary DTOs and Entity classes
import com.arpon007.netflixclone.DTO.request.UserRatingRequest;
import com.arpon007.netflixclone.entity.UserRating;

import java.util.Map;

/**
 * Service interface defining the business logic contracts for User Rating
 * operations.
 */
public interface UserRatingService {

    /**
     * Submits or updates a rating for a video by a user.
     *
     * @param userEmail The email of the authenticated user (obtained from
     *                  SecurityContext).
     * @param request   The request object containing videoId and the rating value.
     * @return The saved UserRating entity.
     */
    UserRating rateVideo(String userEmail, UserRatingRequest request);

    /**
     * Retrieves rating statistics (average rating and total count) for a video.
     *
     * @param videoId The ID of the video.
     * @return A Map containing "average" (Double) and "count" (Long).
     */
    Map<String, Object> getVideoRatingStats(Long videoId);

    /**
     * Retrieves the specific rating given by a user for a video.
     *
     * @param userEmail The email of the user.
     * @param videoId   The ID of the video.
     * @return The rating value (Integer), or 0 if no rating exists.
     */
    Integer getUserRating(String userEmail, Long videoId);
}
