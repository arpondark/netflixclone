package com.arpon007.netflixclone.dao;

import com.arpon007.netflixclone.entity.VideoView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VideoViewRepository extends JpaRepository<VideoView, Long> {

    @Query("SELECT COUNT(v) FROM VideoView v WHERE v.video.video_id = :videoId")
    Long countViewsByVideoId(@Param("videoId") Long videoId);

    @Query("SELECT CASE WHEN COUNT(v) > 0 THEN true ELSE false END FROM VideoView v WHERE v.user.id = :userId AND v.video.video_id = :videoId")
    boolean existsByUserIdAndVideoId(@Param("userId") Long userId, @Param("videoId") Long videoId);
}
