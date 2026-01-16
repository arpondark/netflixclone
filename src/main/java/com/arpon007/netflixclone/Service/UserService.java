package com.arpon007.netflixclone.Service;

import com.arpon007.netflixclone.DTO.request.UpdateProfileRequest;
import com.arpon007.netflixclone.DTO.response.MessageResponse;
import com.arpon007.netflixclone.DTO.response.UserResponse;
import com.arpon007.netflixclone.DTO.response.VideoResponse;

import java.util.List;
import java.util.Set;

public interface UserService {

    UserResponse getUserProfile(String email);

    MessageResponse updateFavoriteCategories(String email, Set<String> categories);

    MessageResponse addToWatchlist(String email, Long videoId);

    MessageResponse removeFromWatchlist(String email, Long videoId);

    List<VideoResponse> getWatchlist(String email);

    MessageResponse recordVideoView(String email, Long videoId);

    MessageResponse uploadAvatar(String email, org.springframework.web.multipart.MultipartFile file)
            throws java.io.IOException;

    Long getVideoViewCount(Long videoId);

    MessageResponse updateProfile(String email, UpdateProfileRequest request);

    MessageResponse deleteAccount(String email);
}
