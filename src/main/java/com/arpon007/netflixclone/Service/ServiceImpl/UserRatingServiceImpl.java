package com.arpon007.netflixclone.Service.ServiceImpl;

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

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserRatingServiceImpl implements UserRatingService {

    private final UserRatingRepository userRatingRepository;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;

    @Override
    @Transactional
    public UserRating rateVideo(String userEmail, UserRatingRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found"));

        Video video = videoRepository.findById(Long.valueOf(request.getVideoId()))
                .orElseThrow(() -> new ResourceNotFoundExCeption("Video not found"));

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Optional<UserRating> existingRating = userRatingRepository.findByUserIdAndVideoId(user.getId(),
                video.getVideo_id());

        UserRating rating;
        if (existingRating.isPresent()) {
            rating = existingRating.get();
            rating.setRating(request.getRating());
        } else {
            rating = new UserRating();
            rating.setUser(user);
            rating.setVideo(video);
            rating.setRating(request.getRating());
        }

        return userRatingRepository.save(rating);
    }

    @Override
    public Map<String, Object> getVideoRatingStats(Long videoId) {
        Double average = userRatingRepository.getAverageRating(videoId);
        Long count = userRatingRepository.countByVideoId(videoId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("average", average != null ? average : 0.0);
        stats.put("count", count != null ? count : 0);
        return stats;
    }

    @Override
    public Integer getUserRating(String userEmail, Long videoId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found"));

        return userRatingRepository.findByUserIdAndVideoId(user.getId(), videoId)
                .map(UserRating::getRating)
                .orElse(0);
    }
}
