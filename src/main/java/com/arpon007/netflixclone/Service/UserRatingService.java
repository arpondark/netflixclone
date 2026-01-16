package com.arpon007.netflixclone.Service;

import com.arpon007.netflixclone.DTO.request.UserRatingRequest;
import com.arpon007.netflixclone.entity.UserRating;

import java.util.Map;

public interface UserRatingService {
    UserRating rateVideo(String userEmail, UserRatingRequest request);

    Map<String, Object> getVideoRatingStats(Long videoId);

    Integer getUserRating(String userEmail, Long videoId);
}
