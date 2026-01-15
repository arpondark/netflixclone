package com.arpon007.netflixclone.ServiceImpl;

import com.arpon007.netflixclone.DTO.response.MessageResponse;
import com.arpon007.netflixclone.DTO.response.UserResponse;
import com.arpon007.netflixclone.DTO.response.VideoResponse;
import com.arpon007.netflixclone.Service.UserService;
import com.arpon007.netflixclone.dao.UserRepository;
import com.arpon007.netflixclone.dao.VideoRepository;
import com.arpon007.netflixclone.dao.VideoViewRepository;
import com.arpon007.netflixclone.entity.User;
import com.arpon007.netflixclone.entity.Video;
import com.arpon007.netflixclone.entity.VideoView;
import com.arpon007.netflixclone.exception.ResourceNotFoundExCeption;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final VideoRepository videoRepository;
    private final VideoViewRepository videoViewRepository;

    @Override
    public UserResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found"));
        return UserResponse.from(user);
    }

    @Override
    @Transactional
    public MessageResponse updateFavoriteCategories(String email, Set<String> categories) {
        if (categories.size() > 3) {
            throw new IllegalArgumentException("Maximum 3 favorite categories allowed");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found"));

        user.setFavoriteCategories(categories);
        userRepository.save(user);

        return new MessageResponse("Favorite categories updated successfully");
    }

    @Override
    @Transactional
    public MessageResponse addToWatchlist(String email, Long videoId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found"));

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new ResourceNotFoundExCeption("Video not found"));

        user.addToWatchList(video);
        userRepository.save(user);

        return new MessageResponse("Video added to watchlist");
    }

    @Override
    @Transactional
    public MessageResponse removeFromWatchlist(String email, Long videoId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found"));

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new ResourceNotFoundExCeption("Video not found"));

        user.removeFromWatchList(video);
        userRepository.save(user);

        return new MessageResponse("Video removed from watchlist");
    }

    @Override
    public List<VideoResponse> getWatchlist(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found"));

        return user.getWatchList().stream()
                .map(video -> {
                    video.setIsInWatchList(true);
                    return VideoResponse.from(video);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageResponse recordVideoView(String email, Long videoId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found"));

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new ResourceNotFoundExCeption("Video not found"));

        // Only record if user hasn't viewed this video before
        if (!videoViewRepository.existsByUserIdAndVideoVideo_id(user.getId(), videoId)) {
            VideoView view = new VideoView(user, video);
            videoViewRepository.save(view);
            return new MessageResponse("Video view recorded");
        }

        return new MessageResponse("Video already viewed");
    }

    @Override
    public Long getVideoViewCount(Long videoId) {
        return videoViewRepository.countViewsByVideoId(videoId);
    }
}
