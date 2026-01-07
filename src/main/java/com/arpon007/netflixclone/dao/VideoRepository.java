package com.arpon007.netflixclone.dao;

import com.arpon007.netflixclone.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VideoRepository extends JpaRepository<Video, Long> {
}
