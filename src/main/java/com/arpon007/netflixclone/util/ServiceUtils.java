package com.arpon007.netflixclone.util;

import com.arpon007.netflixclone.dao.UserRepository;
import com.arpon007.netflixclone.dao.VideoRepository;
import com.arpon007.netflixclone.entity.User;
import com.arpon007.netflixclone.entity.Video;
import com.arpon007.netflixclone.exception.ResourceNotFoundExCeption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ServiceUtils {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VideoRepository videoRepository;

    public User getUserByEmailOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found with email: " + email));
    }


    public User getUserByIdOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundExCeption("User not found with id: " + userId));
    }

    public Video getVideoByIdOrThrow(Long videoId) {
        return videoRepository.findById(videoId)
                .orElseThrow(() -> new ResourceNotFoundExCeption("Video not found with id: " + videoId));
    }
}
