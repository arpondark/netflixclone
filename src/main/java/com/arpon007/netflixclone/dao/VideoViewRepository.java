package com.arpon007.netflixclone.dao;

import com.arpon007.netflixclone.entity.VideoView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VideoViewRepository extends JpaRepository<VideoView, Long> {

    @Query("SELECT COUNT(v) FROM VideoView v WHERE v.video.video_id = :videoId")
    Long countViewsByVideoId(Long videoId);

    boolean existsByUserIdAndVideoVideo_id(Long userId, Long videoId);
}
