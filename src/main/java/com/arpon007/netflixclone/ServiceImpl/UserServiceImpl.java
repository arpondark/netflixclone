package com.arpon007.netflixclone.ServiceImpl;

import com.arpon007.netflixclone.DTO.request.UpdateProfileRequest;
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
    private final FileStorageService fileStorageService;

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
        if (!videoViewRepository.existsByUserIdAndVideoId(user.getId(), videoId)) {
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

    @Override
    @Transactional
    public MessageResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found"));

        // Check if new email already exists (if changed)
        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email already in use");
            }
            user.setEmail(request.getEmail());
        }

        user.setFullName(request.getFullName());
        if (request.getAge() != null) {
            user.setAge(request.getAge());
        }
        userRepository.save(user);

        return new MessageResponse("Profile updated successfully");
    }

    @Override
    @Transactional
    public MessageResponse uploadAvatar(String email, org.springframework.web.multipart.MultipartFile file)
            throws java.io.IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found"));

        String fileName = fileStorageService.saveImage(file);
        user.setAvatar(fileName);
        userRepository.save(user);

        return new MessageResponse("Avatar uploaded successfully");
    }

    @Override
    @Transactional
    public MessageResponse deleteAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found"));

        // Prevent deletion of admin accounts
        if (user.getRole().toString().equals("ADMIN")) {
            throw new IllegalArgumentException("Admin accounts cannot be deleted");
        }

        userRepository.delete(user);
        return new MessageResponse("Account deleted successfully");
    }
}
