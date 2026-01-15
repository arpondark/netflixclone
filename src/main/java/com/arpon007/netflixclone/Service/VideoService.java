package com.arpon007.netflixclone.Service;

import com.arpon007.netflixclone.DTO.request.VideoRequest;
import com.arpon007.netflixclone.DTO.response.VideoResponse;
import com.arpon007.netflixclone.entity.Video;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface VideoService {
    VideoResponse upload(VideoRequest request, MultipartFile video) throws IOException;

    List<VideoResponse> getAll();

    Video getById(Long id);
}
