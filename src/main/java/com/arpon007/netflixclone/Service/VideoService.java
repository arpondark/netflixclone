package com.arpon007.netflixclone.Service;

import com.arpon007.netflixclone.DTO.request.VideoRequest;
import com.arpon007.netflixclone.DTO.response.VideoResponse;
import com.arpon007.netflixclone.entity.Video;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import com.arpon007.netflixclone.DTO.request.UpdateVideoRequest;

public interface VideoService {
    VideoResponse upload(VideoRequest request, MultipartFile video, MultipartFile poster) throws IOException;

    List<VideoResponse> getAll();

    Video getById(Long id);

    VideoResponse update(Long id, UpdateVideoRequest request, MultipartFile poster) throws IOException;

    void delete(Long id);
}
