package com.arpon007.netflixclone.dao;

// Import necessary classes and interfaces
import com.arpon007.netflixclone.entity.UserRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for UserRating entity.
 * Extends JpaRepository to provide standard CRUD operations.
 * Annotated with @Repository to indicate it's a Spring Data component.
 */
@Repository
public interface UserRatingRepository extends JpaRepository<UserRating, Long> {

    /**
     * Finds a UserRating by the User's ID and the Video's ID.
     * Used to check if a user has already rated a specific video.
     *
     * @param userId  The ID of the user.
     * @param videoId The ID of the video.
     * @return An Optional containing the UserRating if found, or empty otherwise.
     */
    Optional<UserRating> findByUserIdAndVideoId(Long userId, Long videoId);

    /**
     * Calculates the average rating for a specific video.
     * Uses a custom JPQL query to compute the average of the 'rating' field.
     *
     * @param videoId The ID of the video to calculate average for.
     * @return The average rating as a Double.
     */
    @Query("SELECT AVG(r.rating) FROM UserRating r WHERE r.video.video_id = :videoId")
    Double getAverageRating(Long videoId);

    /**
     * Counts the total number of ratings for a specific video.
     * Uses a custom JPQL query to count the rating records.
     *
     * @param videoId The ID of the video to count ratings for.
     * @return The count of ratings as a Long.
     */
    @Query("SELECT COUNT(r) FROM UserRating r WHERE r.video.video_id = :videoId")
    Long countByVideoId(Long videoId);
}
