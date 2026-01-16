package com.arpon007.netflixclone.dao;

import com.arpon007.netflixclone.entity.UserRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRatingRepository extends JpaRepository<UserRating, Long> {
    Optional<UserRating> findByUserIdAndVideoId(Long userId, Long videoId);

    @Query("SELECT AVG(r.rating) FROM UserRating r WHERE r.video.video_id = :videoId")
    Double getAverageRating(Long videoId);

    @Query("SELECT COUNT(r) FROM UserRating r WHERE r.video.video_id = :videoId")
    Long countByVideoId(Long videoId);
}
